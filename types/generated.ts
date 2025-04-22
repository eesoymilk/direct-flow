import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Company, CompanyOwner, Representative, CompanyRepresentative, Contact, CompanyContact, BusinessCertificate, User } from '../models';
import { Context } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type BusinessCertificate = {
  __typename?: 'BusinessCertificate';
  company: Company;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type Company = {
  __typename?: 'Company';
  address: Scalars['String']['output'];
  businessCertificate?: Maybe<BusinessCertificate>;
  contacts?: Maybe<Array<CompanyContact>>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  englishName?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  organizationType: CompanyOrganizationType;
  owner?: Maybe<CompanyOwner>;
  phone?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  propertyTaxId?: Maybe<Scalars['String']['output']>;
  representatives?: Maybe<Array<CompanyRepresentative>>;
  taxId?: Maybe<Scalars['String']['output']>;
  taxRegistrationNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CompanyContact = {
  __typename?: 'CompanyContact';
  company: Company;
  contact: Contact;
  createdAt: Scalars['DateTime']['output'];
  isPrimary: Scalars['Boolean']['output'];
};

export enum CompanyOrganizationType {
  Corporation = 'CORPORATION',
  LimitedCompany = 'LIMITED_COMPANY',
  Partnership = 'PARTNERSHIP',
  SoleProprietorship = 'SOLE_PROPRIETORSHIP'
}

export type CompanyOwner = {
  __typename?: 'CompanyOwner';
  company: Company;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  idNumber: Scalars['String']['output'];
  name: Scalars['String']['output'];
  registeredAddress: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CompanyRepresentative = {
  __typename?: 'CompanyRepresentative';
  company: Company;
  createdAt: Scalars['DateTime']['output'];
  isPrimary: Scalars['Boolean']['output'];
  representative: Representative;
};

export type Contact = {
  __typename?: 'Contact';
  address?: Maybe<Scalars['String']['output']>;
  companies?: Maybe<Array<CompanyContact>>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateCompanyInput = {
  address: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  organizationType: CompanyOrganizationType;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  propertyTaxId?: InputMaybe<Scalars['String']['input']>;
  taxId?: InputMaybe<Scalars['String']['input']>;
  taxRegistrationNumber?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addContactToCompany: CompanyContact;
  addFavoriteContact: Scalars['Boolean']['output'];
  addFavoriteRepresentative: Scalars['Boolean']['output'];
  addRepresentativeToCompany: CompanyRepresentative;
  createCompany: Company;
  deleteCompany: Scalars['Boolean']['output'];
  removeContactFromCompany: Scalars['Boolean']['output'];
  removeFavoriteContact: Scalars['Boolean']['output'];
  removeFavoriteRepresentative: Scalars['Boolean']['output'];
  removeRepresentativeFromCompany: Scalars['Boolean']['output'];
  updateCompany: Company;
};


export type MutationAddContactToCompanyArgs = {
  companyId: Scalars['ID']['input'];
  contactId: Scalars['ID']['input'];
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationAddFavoriteContactArgs = {
  contactId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationAddFavoriteRepresentativeArgs = {
  representativeId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationAddRepresentativeToCompanyArgs = {
  companyId: Scalars['ID']['input'];
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  representativeId: Scalars['ID']['input'];
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationDeleteCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveContactFromCompanyArgs = {
  companyId: Scalars['ID']['input'];
  contactId: Scalars['ID']['input'];
};


export type MutationRemoveFavoriteContactArgs = {
  contactId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRemoveFavoriteRepresentativeArgs = {
  representativeId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationRemoveRepresentativeFromCompanyArgs = {
  companyId: Scalars['ID']['input'];
  representativeId: Scalars['ID']['input'];
};


export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};

export type Query = {
  __typename?: 'Query';
  companies: Array<Company>;
  company?: Maybe<Company>;
  contact?: Maybe<Contact>;
  contacts: Array<Contact>;
  representative?: Maybe<Representative>;
  representatives: Array<Representative>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryCompanyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryContactArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRepresentativeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Representative = {
  __typename?: 'Representative';
  address: Scalars['String']['output'];
  companies?: Maybe<Array<CompanyRepresentative>>;
  createdAt: Scalars['DateTime']['output'];
  email?: Maybe<Scalars['String']['output']>;
  fax?: Maybe<Scalars['String']['output']>;
  firmName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  idNumber: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UpdateCompanyInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  englishName?: InputMaybe<Scalars['String']['input']>;
  fax?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  organizationType?: InputMaybe<CompanyOrganizationType>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  propertyTaxId?: InputMaybe<Scalars['String']['input']>;
  taxId?: InputMaybe<Scalars['String']['input']>;
  taxRegistrationNumber?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  favoriteContacts?: Maybe<Array<Contact>>;
  favoriteRepresentatives?: Maybe<Array<Representative>>;
  id: Scalars['ID']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BusinessCertificate: ResolverTypeWrapper<BusinessCertificate>;
  Company: ResolverTypeWrapper<Company>;
  CompanyContact: ResolverTypeWrapper<CompanyContact>;
  CompanyOrganizationType: CompanyOrganizationType;
  CompanyOwner: ResolverTypeWrapper<CompanyOwner>;
  CompanyRepresentative: ResolverTypeWrapper<CompanyRepresentative>;
  Contact: ResolverTypeWrapper<Contact>;
  CreateCompanyInput: CreateCompanyInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Representative: ResolverTypeWrapper<Representative>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdateCompanyInput: UpdateCompanyInput;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  BusinessCertificate: BusinessCertificate;
  Company: Company;
  CompanyContact: CompanyContact;
  CompanyOwner: CompanyOwner;
  CompanyRepresentative: CompanyRepresentative;
  Contact: Contact;
  CreateCompanyInput: CreateCompanyInput;
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Mutation: {};
  Query: {};
  Representative: Representative;
  String: Scalars['String']['output'];
  UpdateCompanyInput: UpdateCompanyInput;
  User: User;
};

export type BusinessCertificateResolvers<ContextType = Context, ParentType extends ResolversParentTypes['BusinessCertificate'] = ResolversParentTypes['BusinessCertificate']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  businessCertificate?: Resolver<Maybe<ResolversTypes['BusinessCertificate']>, ParentType, ContextType>;
  contacts?: Resolver<Maybe<Array<ResolversTypes['CompanyContact']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  englishName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fax?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  organizationType?: Resolver<ResolversTypes['CompanyOrganizationType'], ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['CompanyOwner']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  postalCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  propertyTaxId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  representatives?: Resolver<Maybe<Array<ResolversTypes['CompanyRepresentative']>>, ParentType, ContextType>;
  taxId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  taxRegistrationNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyContactResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CompanyContact'] = ResolversParentTypes['CompanyContact']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  contact?: Resolver<ResolversTypes['Contact'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isPrimary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyOwnerResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CompanyOwner'] = ResolversParentTypes['CompanyOwner']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  registeredAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CompanyRepresentativeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CompanyRepresentative'] = ResolversParentTypes['CompanyRepresentative']> = {
  company?: Resolver<ResolversTypes['Company'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  isPrimary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  representative?: Resolver<ResolversTypes['Representative'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Contact'] = ResolversParentTypes['Contact']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  companies?: Resolver<Maybe<Array<ResolversTypes['CompanyContact']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addContactToCompany?: Resolver<ResolversTypes['CompanyContact'], ParentType, ContextType, RequireFields<MutationAddContactToCompanyArgs, 'companyId' | 'contactId'>>;
  addFavoriteContact?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAddFavoriteContactArgs, 'contactId' | 'userId'>>;
  addFavoriteRepresentative?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAddFavoriteRepresentativeArgs, 'representativeId' | 'userId'>>;
  addRepresentativeToCompany?: Resolver<ResolversTypes['CompanyRepresentative'], ParentType, ContextType, RequireFields<MutationAddRepresentativeToCompanyArgs, 'companyId' | 'representativeId'>>;
  createCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationCreateCompanyArgs, 'input'>>;
  deleteCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCompanyArgs, 'id'>>;
  removeContactFromCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveContactFromCompanyArgs, 'companyId' | 'contactId'>>;
  removeFavoriteContact?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveFavoriteContactArgs, 'contactId' | 'userId'>>;
  removeFavoriteRepresentative?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveFavoriteRepresentativeArgs, 'representativeId' | 'userId'>>;
  removeRepresentativeFromCompany?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveRepresentativeFromCompanyArgs, 'companyId' | 'representativeId'>>;
  updateCompany?: Resolver<ResolversTypes['Company'], ParentType, ContextType, RequireFields<MutationUpdateCompanyArgs, 'input'>>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  companies?: Resolver<Array<ResolversTypes['Company']>, ParentType, ContextType>;
  company?: Resolver<Maybe<ResolversTypes['Company']>, ParentType, ContextType, RequireFields<QueryCompanyArgs, 'id'>>;
  contact?: Resolver<Maybe<ResolversTypes['Contact']>, ParentType, ContextType, RequireFields<QueryContactArgs, 'id'>>;
  contacts?: Resolver<Array<ResolversTypes['Contact']>, ParentType, ContextType>;
  representative?: Resolver<Maybe<ResolversTypes['Representative']>, ParentType, ContextType, RequireFields<QueryRepresentativeArgs, 'id'>>;
  representatives?: Resolver<Array<ResolversTypes['Representative']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
};

export type RepresentativeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Representative'] = ResolversParentTypes['Representative']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  companies?: Resolver<Maybe<Array<ResolversTypes['CompanyRepresentative']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fax?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firmName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  favoriteContacts?: Resolver<Maybe<Array<ResolversTypes['Contact']>>, ParentType, ContextType>;
  favoriteRepresentatives?: Resolver<Maybe<Array<ResolversTypes['Representative']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  BusinessCertificate?: BusinessCertificateResolvers<ContextType>;
  Company?: CompanyResolvers<ContextType>;
  CompanyContact?: CompanyContactResolvers<ContextType>;
  CompanyOwner?: CompanyOwnerResolvers<ContextType>;
  CompanyRepresentative?: CompanyRepresentativeResolvers<ContextType>;
  Contact?: ContactResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Representative?: RepresentativeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

