import OpenAI from 'openai';
import { CompletionPromptTemplates } from './prompts/CompletionPromptTemplates';
import { IOpenAiCompletion } from '../types/IOpenAiCompletion';
import { CompletionSchema } from './schema/CompletionSchema';
import { isCompletionValid } from './guards/isCompletionValid';
import { BadRequestException } from '@nestjs/common';
import { RelationSummaryTemplate } from './prompts/RelationSummaryTemplate';
import { Node } from '../entities/Node';
import { NodeRelationType } from '../enums/NodeRelationType';
import { RelationTypeClassification } from './prompts/RelationTypeClassification';
import { isNodeRelationType } from './guards/isNodeRelationType';

export class OpenAiService {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
  public async createRelationSummary(
    sourceNode: Node,
    targetNode: Node,
  ): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: RelationSummaryTemplate.system },
        {
          role: 'user',
          content: RelationSummaryTemplate.base(sourceNode, targetNode),
        },
      ],
    });

    if (!completion.choices[0].message.content) {
      throw new BadRequestException('Could not create completion');
    }

    return completion.choices[0].message.content.trim();
  }

  async classifyRelationType(
    sourceNodeSummary: string,
    targetNodeSummary: string,
  ): Promise<NodeRelationType> {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: RelationTypeClassification.system },
        {
          role: 'user',
          content: RelationTypeClassification.base(
            sourceNodeSummary,
            targetNodeSummary,
          ),
        },
      ],
    });

    const classification = res.choices[0].message?.content
      ?.trim()
      ?.toLowerCase();

    if (!classification) {
      throw new BadRequestException('Could not create completion');
    }

    if (!isNodeRelationType(classification)) {
      throw new BadRequestException(`Could not identify relation type`);
    }
    return classification;
  }

  public async createEmbeddings(content: string): Promise<number[]> {
    const embeddingRes = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: content,
    });
    if (embeddingRes.data[0].embedding.length == 0) {
      throw new BadRequestException('Could not create embeddings');
    }
    return embeddingRes.data[0].embedding;
  }

  public async createCompletion(
    content: string,
    ranFor: number = 0,
  ): Promise<IOpenAiCompletion> {
    if (ranFor >= 5) {
      throw new BadRequestException('Could not create completion');
    }
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: CompletionPromptTemplates.system,
        },
        {
          role: 'user',
          content: CompletionPromptTemplates.base(content),
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'NodeCompletion',
          strict: true,
          schema: CompletionSchema,
        },
      },
    });

    if (!completion.choices[0].message.content) {
      throw new BadRequestException('Could not create completion');
    }

    const completionResult = JSON.parse(
      completion.choices[0].message.content,
    ) as IOpenAiCompletion;

    if (!isCompletionValid(completionResult)) {
      await this.createCompletion(content, ranFor + 1);
    }

    return completionResult;
  }
}
