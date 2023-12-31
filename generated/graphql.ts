/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: { input: any; output: any };
};

export type CreatePostInput = {
  text: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type FieldError = {
  __typename?: "FieldError";
  field: Scalars["String"]["output"];
  message: Scalars["String"]["output"];
};

export type IMutationResponse = {
  code: Scalars["Float"]["output"];
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
};

export type LoginInput = {
  password: Scalars["String"]["input"];
  usernameOrEmail: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  createPost: PostMutationResponse;
  deletePost: PostMutationResponse;
  login: UserMutationResponse;
  logout: Scalars["Boolean"]["output"];
  register: UserMutationResponse;
  updatePost: PostMutationResponse;
};

export type MutationCreatePostArgs = {
  createPostInput: CreatePostInput;
};

export type MutationDeletePostArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationLoginArgs = {
  loginInput: LoginInput;
};

export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};

export type MutationUpdatePostArgs = {
  updatePostInput: UpdatePostInput;
};

export type Post = {
  __typename?: "Post";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  text: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  updateAt: Scalars["DateTime"]["output"];
};

export type PostMutationResponse = IMutationResponse & {
  __typename?: "PostMutationResponse";
  code: Scalars["Float"]["output"];
  errors?: Maybe<Array<FieldError>>;
  message: Scalars["String"]["output"];
  post?: Maybe<Post>;
  success: Scalars["Boolean"]["output"];
};

export type Query = {
  __typename?: "Query";
  hello: Scalars["String"]["output"];
  post?: Maybe<Post>;
  posts?: Maybe<Array<Post>>;
};

export type QueryPostArgs = {
  id: Scalars["ID"]["input"];
};

export type RegisterInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type UpdatePostInput = {
  id: Scalars["ID"]["input"];
  text: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
};

export type User = {
  __typename?: "User";
  createdAt: Scalars["DateTime"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  updateAt: Scalars["DateTime"]["output"];
  username: Scalars["String"]["output"];
};

export type UserMutationResponse = IMutationResponse & {
  __typename?: "UserMutationResponse";
  code: Scalars["Float"]["output"];
  errors?: Maybe<Array<FieldError>>;
  message: Scalars["String"]["output"];
  success: Scalars["Boolean"]["output"];
  user?: Maybe<User>;
};

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;

export type RegisterMutation = {
  __typename?: "Mutation";
  register: {
    __typename?: "UserMutationResponse";
    code: number;
    message: string;
    success: boolean;
    errors?: Array<{
      __typename?: "FieldError";
      field: string;
      message: string;
    }> | null;
    user?: {
      __typename?: "User";
      id: string;
      username: string;
      email: string;
    } | null;
  };
};

export const RegisterDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "Register" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "registerInput" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "RegisterInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "register" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "registerInput" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "registerInput" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "code" } },
                { kind: "Field", name: { kind: "Name", value: "message" } },
                { kind: "Field", name: { kind: "Name", value: "success" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "errors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "field" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "message" },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "username" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "email" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;

export const RegisterUser = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      code
      message
      success
      errors {
        field
        message
      }
      user {
        id
        username
        email
      }
    }
  }
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
