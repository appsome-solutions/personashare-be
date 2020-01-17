import { Injectable } from '@nestjs/common';
import { parse, FieldNode } from 'graphql';

import { GQLContext } from '../app.interfaces';

const parsedQuery = <T>(
  context: GQLContext,
  queryName: string,
): Array<keyof T> => {
  if (!context.req.body && !context.req.body.query) {
    return [];
  }

  const documentNode = parse(context.req.body.query);
  const fields = documentNode.definitions.map(def => {
    if (def.kind === 'OperationDefinition') {
      const { selections } = def.selectionSet;
      const fields = selections.filter(
        item => item.kind === 'Field' && item.name.value === queryName,
      );

      if (!fields.length) {
        return null;
      }

      return fields[0];
    }
    return null;
  });

  const field = fields[0] as FieldNode;

  if (field.selectionSet && field.selectionSet.kind === 'SelectionSet') {
    return field.selectionSet.selections.map(
      field => (field as FieldNode).name.value as keyof T,
    );
  }

  return [];
};

@Injectable()
export class GqlSelectionParserService {
  getSelectionKeysFromQuery<T>(
    context: GQLContext,
    queryName: string,
  ): Array<keyof T> {
    return parsedQuery(context, queryName);
  }
}
