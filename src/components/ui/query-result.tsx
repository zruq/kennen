import { type TRPCClientErrorLike } from "@trpc/client";
import { type DefinedUseTRPCQueryResult } from "@trpc/react-query/shared";
import {
  type TRPC_ERROR_CODE_KEY,
  type TRPC_ERROR_CODE_NUMBER,
} from "@trpc/server/unstable-core-do-not-import";
import { type ReactNode } from "react";
import { type typeToFlattenedError } from "zod";

type QueryResultProps<TData> = {
  result: DefinedUseTRPCQueryResult<
    TData,
    TRPCClientErrorLike<{
      errorShape: {
        data: {
          //eslint-disable-next-line
          zodError: typeToFlattenedError<any, string> | null;
          code: TRPC_ERROR_CODE_KEY;
          httpStatus: number;
          path?: string;
          stack?: string;
        };
        message: string;
        code: TRPC_ERROR_CODE_NUMBER;
      };
      transformer: true;
    }>
  >;
  children: (data: NonNullable<TData>) => ReactNode;
};
export default function QueryResult<TData>({
  result,
  children,
}: QueryResultProps<TData>) {
  if (result.isLoading) {
    return <div className=""></div>;
  }
  if (result.error) {
    return <div className="text-xs text-red-500">{result.error.message}</div>;
  }
  return children(result.data as NonNullable<TData>);
}
