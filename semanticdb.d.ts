import * as moment from 'moment';
import moment__default from 'moment';
import { DataSourceItemType } from 'semanticdb-core';

declare function isStandardDateForm(dateValue: any): boolean;
/**
 * year + offset形态
 * @param {Object} dateValue e.g. {year: 2025, month: 2}
 * @return {Boolean}
 */
declare function isRelativeDateForm(dateValue: any): boolean;
/**
 * year + offset形态转变成标准的$lte,$gte形态
 * @param {Object} value
 * @param {Object} config
 * @return {Object}
 */
declare function normaliseRelativeDateForm(value: any, config?: any): any;

/**
 * SemanticType
 * Base Class
 */
declare class SemanticType {
    /**
     * constructor
     * @param {*} config
     */
    constructor(config: any);
    config: any;
    parsers: any[];
    /**
     * normalize
     * @param {*} value
     * @return {Promise} normalized value and additonal values
     */
    normalize(value: any): Promise<any>;
    /**
     * learn
     * 这个learn看似和distinct有所重复，其实不一样。
     * learn要把所有同义词也给学习进去
     * @param {String} schemaID
     * @param {String} propertyName
     * @return {Array} learned result array
     */
    learn(schemaID: string, propertyName: string): any[];
    /**
     * 返回数据的distinct
     * 用作前端筛选
     * @return {Array} distinct array
     */
    distincts(): any[];
    /**
     *
     * @param {String} regex
     * @param {Function} action
     */
    addParser(regex: string, action: Function): void;
    /**
     * getDisplayValue
     * @param {*} value
     * @return {*} display value
     */
    getDisplayValue(value: any): any;
    isNumber(value: any): boolean;
}

/**
 * 中国手机
 */
declare class ChinaMobile extends SemanticType {
    /**
     * constructor
     */
    constructor();
    primal_type: string;
    regex: string;
    /**
     * normalize
     * 注意，目前这个要求映射到数据库的index，也能成为参数。见代码里面注释
     * @param {String} v
     * @return {Promise} index of the value
     */
    normalize(v: string): Promise<any>;
}

/**
 * Markdown
 * 以Markdown的格式保存。主要是前端显示有区别
 */
declare class Markdown extends SemanticType {
    /**
     * constructor
     */
    constructor();
    primal_type: string;
}

/**
 * Punctuations
 * 标点符号，Dist很大
 */
declare class Punctuations extends SemanticType {
    /**
     * constructor
     */
    constructor();
    primal_type: string;
}

/**
 * Text
 */
declare class Text extends SemanticType {
    /**
     * constructor
     */
    constructor();
    primal_type: string;
}

/**
 * Url
 * TODO: parser
 */
declare class Url extends SemanticType {
    /**
     * constructor
     */
    constructor();
    primal_type: string;
}

/**
 * Percentage
 * 百分比
 */
declare class Percentage extends SemanticType {
    /**
     * constructor
     */
    constructor();
    primal_type: string;
    /**
     * normalize
     * @param {String} value
     * @return {Promise} normalized value
     */
    normalize(value: string): Promise<any>;
}

/**
 * Currency
 * 货币
 */
declare class Currency extends SemanticType {
    /**
     * constructor
     * @param {String} config
     */
    constructor(config: string);
    primal_type: string;
    semanticNumberParser: any;
    units: string[];
    /**
     * normalize
     * @param {String} value
     * @return {Promise} normalized value
     */
    normalize(value: string): Promise<any>;
    /**
     * normalizeValueSync
     * @param {String} value
     * @return {Number} normalized value
     */
    normalizeValueSync(value: string): number;
}

/**
 * Number
 * 支持英文数字和中文数字
 */
declare class SemanticNumber extends SemanticType {
    /**
     * constructor
     */
    constructor();
    primal_type: string;
    numberChars: string[][];
    scaleChars: string[][];
    fracChars: string[];
    otherChars: string[];
    quantifierRegex: string;
    parse(matchedString: any): any;
}

/**
 * @abstract
 */
declare abstract class SchemaUpdater {
    /**
     * Materialize current update plan
     * Returns SchemaDefinition after updates
     * if debug is true, then only print out plan
     * @abstract
     * @param {boolean} dry
     * @return {Promise<SchemaDefinition>}
     */
    synchronize({ dry }: {
        dry: any;
    }): void;
    /**
     * @abstract
     * @param {SchemaDefinition} otherDef
     * @return {this}
     */
    computePlan(otherDef: any): void;
    abstract get planJSON(): {
        scope: string;
        action: string;
        specification: any;
    }[];
    /**
     * @abstract
     */
    reset(): void;
    /**
     * @abstract
     * @param {string} v
     * @return {this}
     */
    setDescription(v: any): void;
    /**
     * @abstract
     * @param {string[]} v
     * @return {this}
     */
    setSyno(v: any): void;
    /**
     * @abstract
     * @param {boolean} v
     * @return {this}
     */
    setEditable(v: any): void;
    /**
     * @abstract
     * @param {string | null} v
     * @return {this}
     */
    setViewSQL(v: any): void;
    /**
     * @abstract
     * @param {*} v
     * @return {this}
     */
    setHierarchy(v: any): void;
    /**
     * @abstract
     * @param {object} prop
     */
    addProperty(prop: any): void;
    /**
     * @abstract
     * @param {object} partialProp
     */
    dropProperty(partialProp: any): void;
    /**
     * @abstract
     * @param {object} partialProp
     */
    updateProperty(partialProp: any): void;
    /**
     * @param {string[]} newOrder
     */
    reorderProperty(newOrder: any): void;
}

/**
 * @abstract
 */
declare class UpdateCommand {
    /**
     * 获取作用域，子类必须实现
     * @abstract
     * @return {string} - 例如 'document', 'array'
     */
    get scope(): string;
    /**
     * 获取操作类型，子类必须实现
     * @abstract
     * @return {string}
     */
    get action(): string;
    /**
     * 获取操作参数，子类必须实现
     * @abstract
     * @return {Object}
     */
    get specification(): any;
    serialize(): {
        scope: string;
        action: string;
        specification: any;
    };
}

declare class SchemaUpdatePlan {
    /**
     * @param {SchemaDefinition} existedSchemaDef
     * @param {boolean} isReadOnly
     */
    constructor(existedSchemaDef: SchemaDefinition, isReadOnly: boolean);
    /**
     * @type {UpdateCommand[]}
     */
    _commands: UpdateCommand[];
    _def: SchemaDefinition;
    _isReadOnly: boolean;
    serialize(): {
        scope: string;
        action: string;
        specification: any;
    }[];
    get documentScopeCommands(): UpdateCommand[];
    get propertyScopeCommands(): UpdateCommand[];
    get propertyOrderCommands(): UpdateCommand[];
    get tableScopeCommands(): UpdateCommand[];
    /**
     * @param {string[]} newOrder
     */
    registerReorderProperty(newOrder: string[]): void;
    registerAddProperty(property: any): void;
    registerDropProperty(property: any): void;
    /**
       * update property is decomposed into
       * multiple DocumentUpdate and SQLExecution commands
       * @param {*} fieldChanged
       * @param {{getEnumUpdateSQLs: function(string[], string[]): string[]}} helper
       */
    registerUpdateProperty(fieldChanged: any, { getEnumUpdateSQLs }: {
        getEnumUpdateSQLs: (arg0: string[], arg1: string[]) => string[];
    }): void;
    /**
     * @param {string[]} path
     * @param {*} value
     */
    registerDocumentUpdate(path: string[], value: any): void;
    registerSQLExecution(sql: any): void;
    _getCommands(predicate: any): UpdateCommand[];
    _registerDocumentUpdateRecursive(path: any, value: any): void;
}

/**
 * Default Schema Updater Implementation
 * Depends on existed routines from DbConnector, Schema and Property
 */
declare class SchemaUpdaterImpl extends SchemaUpdater {
    private _schemaDef;
    private _schemaId;
    private _dbconnector;
    private _schema;
    private _mongoClient;
    private targetdb;
    _plan: SchemaUpdatePlan;
    /**
     * @param {SchemaDefinition} def
     **/
    constructor(def: any);
    /**
     * @param {SchemaDefinition} otherDef
     * @return {this}
     */
    computePlan(otherDef: any): this;
    /**
     * @param {SchemaDefinition} otherDef
     * @private
     */
    _computePlanOnSchemaFields(otherDef: any): void;
    /**
     * @param {SchemaDefinition} proposedDef
     * @private
     */
    _computePlanOnProperties(proposedDef: any): void;
    /**
     * @param {SchemaDefinition} otherDef
     * @return {*}
     * @private
     */
    _computePropsToDrop(otherDef: any): any[];
    _computePropsToAdd(otherDef: any): any[];
    _computePropsToChange(proposedDef: any): any[];
    synchronize(opts?: {
        dry?: boolean;
    }): Promise<SchemaDefinition>;
    get planJSON(): {
        scope: string;
        action: string;
        specification: any;
    }[];
    reset(): this;
    setDescription(v: any): this;
    setSyno(v: any): this;
    setEditable(v: any): this;
    setHierarchy(v: any): this;
    addProperty(prop: any): this;
    dropProperty(partialProp: any): this;
    updateProperty(partialProp: any): this;
    reorderProperty(newOrder: any): void;
    _isValidPropertyUDFUpdate(currentProp: any, toUdf: any): boolean;
    _isValidPropertyTypeUpdate(currentProp: any, toType: any): boolean;
    _applyPropertyScopeUpdates(): Promise<void>;
    _applyTableScopeUpdates(): Promise<void>;
    _applyDocumentScopeUpdates(options?: {
        plan?: SchemaUpdatePlan;
    }): Promise<void>;
    _applyPropertyOrderUpdates(): Promise<void>;
}

declare class QueryDefinition {
    static of(o: any): QueryDefinition;
    private readonly _o;
    constructor(o: any);
    raw(): any;
    hasDuplicateQueryPath(): boolean;
    flattenQueryObject(): any;
    /**
     * @return {QueryItem[]}
     */
    _collectChildrenQueryObjects(): any[];
    collectQueryObjectAtDepth(depthStr: any): any;
    _collectQueryItem(key: any, queryObj: any, keyCollect: any, resultCollect: any, customStopCondition: any): void;
    _isLeafQueryObject(o: any): boolean;
    /**
     * @description 如果是新的path，就会去创建一个新的键值对。如果已存在，需要根据path中已有的operator和即将进入的新的operator做对比(旧，新）：
     * 如果是（$eq,$eq), 则需要把操作符换成$in; 如果是(others, $eq), 则只保留新的；其余情况暂时用{ ...this._o[path], ...spec }处理。
     * @param {QueryItem} qi
     * @return {*}
     */
    addQueryItem(qi: any): this;
}

declare type AnyObject = {
    [k: string]: any;
};
declare type ExtendedDataSourceItemType = DataSourceItemType & {
    partitionFunction?: string;
    cluster?: boolean;
    shardingKey?: string;
    time?: Record<string, any>;
};
declare type DBConnectorConfig = {
    project: string;
    db?: ExtendedDataSourceItemType[] | ExtendedDataSourceItemType;
    cache?: boolean;
    metaDB?: {
        client: 'mongodb';
        connection: {
            url: string;
        };
    };
    no_underscoreid_column_in_entity?: boolean;
};

interface AnalyzeQueryConditionOptions {
    encloseParentheses?: boolean;
    quantifyReceiver?: boolean | string;
    dialect?: string;
}

declare class LogicFormDefinition {
    static TOTALITY_DIMENSION_ARITY_UPPER_BOUND: number;
    static of(lf: any, helperFunctions: any, lfExecutor: any): LogicFormDefinition;
    private readonly _lf;
    private readonly _schemaLookup;
    private readonly _customFunctionsLookup;
    private readonly _baseschema;
    private readonly _executor;
    constructor(lf: any, helperFunctions: any, lfExecutor: any);
    get baseschema(): SchemaDefinition;
    get schemaLookup(): any;
    raw(): any;
    get groupby(): any;
    get preds(): any;
    get props(): any;
    get having(): any;
    get sort(): any;
    get skip(): any;
    get limit(): any;
    get limitBy(): any;
    get query(): any;
    get queryDef(): QueryDefinition;
    /**
     * @description analyzeQueryConditions4CK返回一个CompoundQueryCondition类的对象，这个对象包含toSQL方法和根据lf query生成的数组（conditions）
     * @param queryDocument lf的query
     * @param schemaDocument lf的schema
     * @param schemaLookup lf的schemas
     * @param customFunctionsLookup 所有自定义函数
     * @param config 配置
     * @param options 配置
     * @returns sql where/having子句
     */
    static encodeQueryConditionsToSQL(queryDocument: AnyObject, schemaDocument: AnyObject, schemaLookup: AnyObject, customFunctionsLookup: AnyObject, config: AnyObject, options?: AnalyzeQueryConditionOptions): string;
    findPropByPredStr(predStr: any): any;
    findPropBySortKey(sortKey: any, targetSchema: any): any;
    _findPropByName(name: any, thisSchema: any): any;
    isSimpleLF(): boolean;
    /**
     * @param {*[]} results
     * @param {*} DBConnector
     * @param {*} commonLib
     * @param {*} targetSchema
     */
    applyHavingSortLimitSkip(results: any, { DBConnector, commonLib, targetSchema }: {
        DBConnector: any;
        commonLib: any;
        targetSchema: any;
    }): Promise<any>;
    _applyHaving(results: any, { DBConnector }: {
        DBConnector: any;
    }): Promise<any>;
    _applySkip(results: any): any;
    _applySort(results: any, { commonLib, targetSchema }: {
        commonLib: any;
        targetSchema: any;
    }): any;
    _getComparatorFn(targetSchema: any, sortKey: any): typeof noopComparator;
    _applyLimit(results: any): any;
    _limitByGroups(results: any): unknown;
    /**
     * Emulate Clickhouse LIMIT BY facility, see
     * https://clickhouse.com/docs/en/sql-reference/statements/select/limit-by/
     *
     * "
     *  A query with the LIMIT n BY expressions clause selects the first n rows for each distinct value of expressions.
     *  The key for LIMIT BY can contain any number of expressions.
     * "
     *
     * @param {object[]} results
     * @param {Function} valueGetter  the distinct value getter (object) -> String
     * @param {number | null} limit
     * @return {object[]}
     */
    _collectLimitBy(results: any, valueGetter: any, limit: any): unknown;
    getNotHappenedDimensionsResult(results: any): Promise<any[]>;
    _getZeroValueRowOfNonGroupKeySelections(): {};
    _getNonGroupKeySelections(): any[];
    _getNotHappenedDimensions(results: any): Promise<any>;
    /**
     * @param {*} results
     * @return {Promise<Map<string, object>>}
     */
    _getFullDimensions(results: any): Promise<{}>;
    /**
     * return example:
     * {
     *   <composite-key>: [<group-name>: <group-value>, ...]>
     *   'a1': [{group_1: a, group_2: 1}]
     *   'a2': [{group_1: a, group_2: 2}]
     *   ...
     * }
     *
     * @param {*} results
     * @return {Promise<Map<string, object>>}
     * @private
     */
    _getDimensionPermutation(results: any): Promise<{}>;
    /**
     * Analyze Groupings, produce a collection of RelationConstraints
     * @private
     * @return {Promise<RelationConstraint[]>}
     */
    _analyzeRelationConstraintsOnGroupings(): Promise<any[]>;
    /**
     * Produce a AsyncRelationConstraint[] from relevant query document entries
     * @private
     * @return {AsyncRelationConstraint[]}
     */
    _analyzeRelationConstraintsOnQuery(): any[];
    _buildConstraintsCausedByTemporalDimension({ group, property }: {
        group: any;
        property: any;
    }, groupSelections: any): any[];
    _buildConstraintsCausedByRefObject({ group, property }: {
        group: any;
        property: any;
    }, groupSelections: any): Promise<any[]>;
    _getGroupKeySelections(): any[];
    /**
     * @param {*} groupObj
     * @return {string}
     */
    _getCompositeKey(groupObj: any): any;
    /**
     * how lf arrange the concatenation order for each dimension used to
     * group result
     * @return {string[]}
     * @private
     */
    _groupNameConcatList(): any;
    /**
     * return full set of elements if property can be bounded
     * @param {*} pred
     * @param {*} occurrenceArr
     * @param {*} group
     * @param {*} property
     * @private
     * @return {Promise<*[]>}
     */
    _getTotality({ pred, group, property }: {
        pred: any;
        group: any;
        property: any;
    }, occurrenceArr: any): Promise<any>;
    _getRefObjectTotality({ pred, group, property }: {
        pred: any;
        group: any;
        property: any;
    }, occurrenceArr: any): Promise<any>;
    /**
     * Reconstruct a query document from a LF query document
     * against referenced Schema
     * CASE 1 - Scalar condition against [id]
     * this.query is {A: 1}
     * then relatedQueryAgainstRefDim is a scalr 1
     *
     * CASE 2 - Operator condition against [id]
     * this.query is {A: {$in: [1]}
     * then relatedQueryAgainstRefDim is an object {$in: [1]}
     *
     * CASE 3 - Chaining conditions on other props of ref dim
     * this.query is {A_b: 2}
     * then relatedQueryAgainstRefDim becomes {id: {$exists: true}, b: 2}
     * @param {string} predOfRefDim - the pred object relevant to a ref dim, can be A or A_b form
     * @param {*} refSchema
     * @return {*} a query object used against ref schema
     */
    _constructQueryAgainstRefDim(predOfRefDim: any, refSchema: any): {};
    _getEnumTotality({ pred, group, property }: {
        pred: any;
        group: any;
        property: any;
    }, occurrenceArr: any): any;
    _getTimestampTotality({ pred, group, property }: {
        pred: any;
        group: any;
        property: any;
    }, occurrenceArr: any): any;
    _areGroupsAllBounded(): boolean;
    /**
     * @param {string} queryItemKey
     * @return {boolean}
     * @private
     */
    _isTimestampQueryItemBoundInTime(queryItemKey: any): boolean;
    /**
     * @param {string} queryItemKey
     * @return {moment.Moment[]|null}
     * @private
     */
    _getTimestampQueryItemTimeBound(queryItemKey: any): moment__default.Moment[];
    localizeReferencedSCDProps(): void;
    _localizeGroupyReferencedSCD(): any;
    _localizePredsReferencedSCD(): any;
    _localizeQueryReferencedSCD(): {};
    /**
     * Process a chain expr 'A_B_C...._D'.
     *
     * Localize SCD prop ref where required
     * @param {string | object} s
     * @return {string | object}
     * @private
     */
    _localizeChainReference(s: any): any;
    /**
     * Turn 'A_B' to 'AB' if A is entity schema and
     * A.B is SCD property.
     * It assumes event schema has localized SCD 'AB'
     * defined in prior
     * @param {string} p1
     * @param {string} p2
     * @param {SchemaDefinition} baseSchema
     * @return {string}
     * @private
     */
    _tryLocalizeOneLevelChainExpr(p1: any, p2: any, baseSchema: any): string;
    /**
     * test a chain particle 'p1_p2', decide if it should be localized into 'p1p2'
     *
     * p1 is a property defined on baseSchema
     * if p1 is a reference prop {type: 'object', ref: '<ref_id>'}
     *    resolve refereeSchema = schemaLookup[baseSchema.property(p1).ref]
     *    p2 should be a property defined on refereeSchema
     *    test if p2 is an SCD property
     * @param {string} p1
     * @param {string} p2
     * @param {SchemaDefinition} baseSchema
     * @private
     * @return {boolean}
     */
    _isP2SCDProperty(p1: any, p2: any, baseSchema: any): any;
    /**
     * expecting p1 is a reference property defined on baseSchema
     * return SchemaDefinition of the referee schema pointed by p1
     * @param {string} p1
     * @param {SchemaDefinition} baseSchema
     * @private
     * @return {SchemaDefinition | null}
     */
    _findRefereeSchema(p1: any, baseSchema: any): SchemaDefinition;
}
declare function noopComparator(a: any, b: any): number;

/**
 * @abstract
 */
declare class SchemaDefinition {
    /**
     * @param {string} id
     * @return {Promise<SchemaDefinition>}
     */
    static loadById(id: string): Promise<SchemaDefinition>;
    static of(o: any): SchemaDefinition;
    /**
     * use factory method `of`, do not instantiate SchemaDefinition
     * directly
     * @param {*} o
     */
    constructor(o: any);
    document: any;
    _id: any;
    _scd: {};
    raw(): any;
    get id(): any;
    get schemaName(): any;
    get description(): any;
    get editable(): any;
    get syno(): any;
    get hierarchy(): any;
    set properties(arg: any);
    get properties(): any;
    getUpdater(options: any): SchemaUpdaterImpl;
    getRankOfProperty(prop: any): any;
    _addTransientProperty(p: any): void;
    getSelfProperty(idOrName: any): any;
    /**
     * @param {string} name
     * @param {Map<string, object>} schemaLookup
     * @return {{primal_type: string, name: string, type: string}|*}
     */
    getPropertyFollowChain(name: string, schemaLookup: Map<string, object>): {
        primal_type: string;
        name: string;
        type: string;
    } | any;
    /**
     * @param {object} predItem
     * @param {LogicFormDefinition} lf
     * @param {object} helperFunctions
     * @return {*}
     */
    getPropertyFromPredItem(predItem: object, lf: LogicFormDefinition, helperFunctions: object): any;
    getSelfPropertyByName(name: any): any;
    getSelfPropertyById(id: any): any;
    getReferenceProps(): any;
    isEntity(): boolean;
    isEvent(): boolean;
    enrichRelatedSCDProps(schemaLookup: any): void;
    scdLookup(): {};
    changeableProperties(): any;
}

declare class DBClient {
    protected connectionConfig: any;
    connection: any;
    client: string;
    QUOTE: string;
    topLimit: boolean;
    uuidFunc: string;
    rownumFunc: string;
    useAliasInGroupby: boolean;
    cluster: boolean;
    shardingKey: string;
    partitionFunction?: string;
    saasTenantNameKey?: string;
    jdbcDatabaseMark?: string;
    constructor(connectionConfig: any);
    getDBName(): any;
    connect(): Promise<void>;
    close(): Promise<void>;
    initDatabase(): Promise<void>;
    dropDatabase(): Promise<void>;
    createTable(schema: any): Promise<void>;
    /**
     * @description 获取表结构, 返回结果的格式是array of object，object内至少有column（字段id）和type（字段类型）
     * @param {Object} schema
     * @return {Array}
     */
    describeTable(schema: any): Promise<any[]>;
    createData(schema: any, data: any): Promise<any>;
    n(prop: any): string;
    q(v: string): string;
    nWithSchema(prop: any, schemaID: string): string;
    timestampWrapper(tms: string): string;
    runSQLByUDBC(sql: string, params?: any): Promise<any>;
    runSQL(sql: string, params?: any): Promise<any[]>;
    typeMapping(property: any): string;
    dateLevel(property: any, params: any[], schemaID: string, config: any): string;
    getUpdateCmd(dbname: string, schemaid: string, updateCMD: string, querystring: string): Promise<string>;
    getRemoveByIDCmd(dbname: string, schemaid: string, IDProp: string, id: string): Promise<string>;
    getRemoveByQueryCmd(dbname: string, schemaid: string, query: string): Promise<string>;
    /**
     * @description 生成$uniq的selectstring
     * @return {String}
     */
    getUniqSelectString(params: string[]): string;
}

declare class OracelClient extends DBClient {
    constructor(connectionConfig: any);
    connect(): Promise<void>;
    close(): Promise<void>;
    describeTable(schema: any): Promise<any>;
    runSQL(sql: any, params?: any): Promise<any>;
    timestampWrapper(tms: string): string;
    dateLevel(property: any, params: any, schemaID: any, config: any): string;
    typeMapping(property: any): string;
}

declare class StarRocksClient extends DBClient {
    constructor(connectionConfig: any);
    close(): Promise<void>;
    initDatabase(): Promise<void>;
    dropDatabase(): Promise<void>;
    describeTable(schema: any): Promise<any>;
    runSQL(sql: any, params?: any): Promise<any>;
    getUpdateCmd(dbname: any, schemaid: any, updateCMD: any, querystring: any): Promise<string>;
    getRemoveByIDCmd(dbname: string, schemaid: string, IDProp: string, id: string): Promise<string>;
    getRemoveByQueryCmd(dbname: string, schemaid: string, query: string): Promise<string>;
    dateLevel(property: any, params: any, schemaID: any, config: any): string;
    typeMapping(property: any): string;
}

declare class MaxComputeClient extends StarRocksClient {
    constructor(connectionConfig: any);
    describeTable(schema: any): Promise<any[]>;
    dateLevel(property: any, params: any, schemaID: any, config: any): string;
    runSQL(sql: string): Promise<any>;
    getUpdateCmd(dbname: any, schemaid: any, updateCMD: any, querystring: any): Promise<string>;
    getRemoveByIDCmd(dbname: string, schemaid: string, IDProp: string, id: string): Promise<string>;
    getRemoveByQueryCmd(dbname: string, schemaid: string, query: string): Promise<string>;
}

declare class ClickhouseClient extends DBClient {
    constructor(connectionConfig: any);
    connect(): Promise<void>;
    close(): Promise<void>;
    initDatabase(): Promise<void>;
    dropDatabase(): Promise<void>;
    createTable(schema: any): Promise<any>;
    describeTable(schema: any): Promise<any>;
    getUpdateCmd(dbname: any, schemaid: any, updateCMD: any, querystring: any): Promise<string>;
    getRemoveByIDCmd(dbname: string, schemaid: string, IDProp: string, id: string): Promise<string>;
    getRemoveByQueryCmd(dbname: string, schemaid: string, query: string): Promise<string>;
    createData(schema: any, data: any): Promise<any>;
    runSQL(sql: any, params?: any): Promise<any>;
    dateLevel(property: any, params: any[], schemaID: any, config: any): string;
    getUniqSelectString(params: string[]): string;
    typeMapping(property: any): string;
    getAddTypeAndValue(offset: any): any[];
}

declare class PostgresClient extends DBClient {
    constructor(connectionConfig: any);
    close(): Promise<void>;
    initDatabase(): Promise<void>;
    dropDatabase(): Promise<void>;
    describeTable(schema: any): Promise<any>;
    runSQL(sql: any): Promise<any>;
    dateLevel(property: any, params: any, schemaID: any, config: any): string;
    typeMapping(property: any): string;
}

declare class MySQLClient extends StarRocksClient {
    constructor(connectionConfig: any);
    getUpdateCmd(dbname: any, schemaid: any, updateCMD: any, querystring: any): Promise<string>;
    getRemoveByIDCmd(dbname: string, schemaid: string, IDProp: string, id: string): Promise<string>;
    getRemoveByQueryCmd(dbname: string, schemaid: string, query: string): Promise<string>;
}

declare const SemanticDB: {
    start: (config: DBConnectorConfig) => Promise<void>;
    close: () => Promise<void>;
    dropDatabase: () => Promise<void>;
    initDatabase: () => Promise<void>;
    runSQL: (sql: any) => Promise<any>;
    DBConnector: {
        mongoClient: any;
        dbclient: {
            [key: string]: {
                [key: string]: any;
                client: string;
            };
        };
        measurementManager: any;
        config: DBConnectorConfig;
        getMainDB(): string;
        connect(config: DBConnectorConfig): Promise<void>;
        close(): Promise<void>;
        getDBName(client?: any): any;
        getClientForSchema(schema: any): {
            [key: string]: any;
            client: string;
        };
        getSchemaCollection(): any;
        getCacheCollection(): any;
        cacheHit(sql: string, useCache: boolean): Promise<any>;
        expireCache(query?: {}): Promise<void>;
        saveCache(sql: any, result: any, schemaID: any): Promise<void>;
        getHistoricalDataCollection(): any;
        saveHistoricalData(id: any, result: any, total: any): Promise<void>;
        removeHistoricalData(id: any): Promise<void>;
        getHistoricalData(id: any): Promise<any>;
        getSemanticTypeCollection(): any;
        getHavingCollection(): any;
        getMongoMainDB(): any;
        initDatabase(): Promise<void>;
        dropDatabase(): Promise<void>;
        createSchema(params: any): Promise<void>;
        getCreateTableCmd(schema: any): Promise<any>;
        countSchemas(query: any): Promise<any>;
        findSchemas(query?: any): Promise<any>;
        getSchemaDict(query: any): Promise<{}>;
        findOneSchema(query: any, option?: any): Promise<any>;
        updateOneSchema(schemaID: any, update: any): Promise<void>;
        removeOneSchema(schemaID: any): Promise<void>;
        createIndexes(schema: any, indexes: any): Promise<any[]>;
        createIndex(schema: any, index: any, option: any): Promise<any>;
        objectIdWrapper(_id: any): any;
        generateObjectID(): any;
        createData(schema: any, data: any): Promise<any>;
        describeTable(schema: any): Promise<any>;
        runSQLWrapper(schema: any, sql: any, params?: {}): Promise<void>;
        alignPropAndColumnOrder(schema: any): Promise<void>;
        updateData(schema: any, query: any, updateItem: any): Promise<any>;
        removeAllData(schema: any): Promise<void>;
        removeData(schema: any, query: any): Promise<any>;
        removeDataByID(schema: any, dataID: any): Promise<any>;
        dataExists(schema: any, query: any): Promise<any>;
        findOneData(schema: any, query: any): Promise<any>;
        mongoPipelineWithTime(schema: any, query: any, option: any): {
            $addFields: {
                [x: number]: {
                    $function: {
                        body: any;
                        args: any;
                        lang: string;
                    };
                };
            };
        }[];
        findData(schema: any, query: any, groupby: any, option?: Record<string, any>): Promise<any>;
        countData(schema: any, query: any, option?: Record<string, any>): Promise<any>;
        aggregateData(schema: any, pipeline: any, option: any): Promise<any>;
        runLFOnClickhouseSQL(logicform: any, schema: any, helperFunctions: any): Promise<any>;
        addLimitIfNotExists(sql: any, client: any): any;
        runSQL(sql: string, param?: any): Promise<any>;
        createOneSemanticType(semanticType: any): Promise<void>;
        findSemanticTypes(query: any, option: any): Promise<any>;
        havingResult(result: any, query: any): Promise<any>;
        å: any;
        normalizeQuery(query: {
            [key: string]: any;
        }): void;
        addObservation(schema: any, propertyName: any, dataID: any, timestamp: any, observation: any): Promise<void>;
        exportData(logicform: any, filename: any, schema: any, helperFunctions: any, lfLength?: number, result?: any[]): Promise<string>;
        getDBConnectionString(dbConfig: any): string;
        addOneProperty(schema: any, property: any, position: any): Promise<void>;
        removeOneProperty(schema: any, property: any): Promise<void>;
        renameOneProperty(schema: any, oldName: any, newName: any): Promise<void>;
        changeOrdinalEnumPropertyTypeSQLs(property: any, oldEnums: any, newEnums: any, schema: any): string[];
        changeOrdinalEnumPropertyType(schema: any, property: any, oldEnumItems: any, newEnumItems: any): Promise<void>;
        testConnection(clientID: string): Promise<{
            success: boolean;
            message: string;
        }>;
        getMeasurementManager(): any;
        getDblientList(): string[];
        getDBClasses(): {
            MySQLClient: typeof MySQLClient;
            PostgresClient: typeof PostgresClient;
            ClickhouseClient: typeof ClickhouseClient;
            MaxComputeClient: typeof MaxComputeClient;
            OracleClient: typeof OracelClient;
        };
    };
    Schema: {
        getSchemaDefinition: () => typeof SchemaDefinition;
        create: (params: any) => Promise<any>;
        find: (query: any) => Promise<any>;
        findOne: (schemaID: any, expandRef: any) => Promise<any>;
        clean: (params: any) => any;
        count: (query: any) => Promise<any>;
        updateOne: (schemaID: any, newSchema: any) => Promise<void>;
        addOneProperty: (schemaID: any, property: any, position: any) => Promise<void>;
        renameOneProperty: (schemaID: any, oldName: any, newName: any) => Promise<void>;
        removeOneProperty: (schemaID: any, propertyName: any, propertyId: any) => Promise<void>;
        removeOne: (schemaID: any) => Promise<void>;
        Property: {
            isCategoricalOnTheFly: (property: any) => boolean;
            isSemantic: (property: any) => boolean;
            normalizeValue: (property: any, value: any, useSQLTimeFormat: any) => Promise<any>;
            create: (property: any, config: any) => any;
            clean: (property: any, config?: any) => void;
        };
        addListener: (event: any, func: any) => void;
        removeListener: (event: any, func: any) => void;
        findPropByName: (schema: any, propName: any, schemas: any) => any;
    };
    Data: {
        create: (s: any, data: any[], config?: any) => Promise<{}[]>;
        update: (s: any, dataID: string, updateItem: any) => Promise<any>;
        find: (schema: any, query: any, option: any) => Promise<any>;
        updateFast: (schema: any, query: any, updateItem: any) => Promise<void>;
        remove: (schemaID: any, query: any) => Promise<void>;
        removeOneByID: (schemaID: any, dataID: any, refCheck?: boolean) => Promise<void>;
        extinctOneByID: (schemaID: any, dataID: any) => Promise<void>;
        distinct: (schema: any, field: any, query: any, option: any) => Promise<never>;
        findOneByID: (schema: any, ID: string) => Promise<any>;
        findOne: (schema: any, query: any) => Promise<any>;
        count: (schema: any, query: any, option: any) => Promise<any>;
        aggregate: (schema: any, pipeline: any, option: any) => Promise<any>;
        runLFOnClickhouseSQL: (logicform: any, schema: any) => Promise<any>;
        addListener: (event: any, func: any) => void;
        removeListener: (event: any, func: any) => void;
        Observation: {
            add: (schema: any, propertyName: string, dataID: any, timestamp: Date, observation: number) => Promise<void>;
        };
    };
    SemanticType: {
        all: () => (SemanticNumber | Currency | Percentage | Url | Text | Punctuations | Markdown | ChinaMobile)[];
        init: () => void;
        findOne: (type: any) => any;
        create: (semanticType: any) => Promise<void>;
        start: (config: any) => Promise<void>;
    };
    Logicform: {
        execute: (logicform: any, config?: {}) => Promise<any>;
        normalizer: (logicform: any, config?: {}) => Promise<any>;
        CustomFunctionController: {
            start: () => Promise<void>;
            close: () => Promise<void>;
            findOne: () => never;
            find: (id: any) => Promise<any>;
            create: (func: any) => Promise<void>;
            remove: (_id: any) => Promise<void>;
            removeBySchema: (schemaID: any) => Promise<void>;
            addListener: (event: any, listener: any) => void;
            removeListener: (event: any, listener: any) => void;
            init: () => Promise<void>;
        };
        util: {
            isRelativeDateForm: typeof isRelativeDateForm;
            isStandardDateForm: typeof isStandardDateForm;
            normaliseRelativeDateForm: typeof normaliseRelativeDateForm;
            nameForPredNode: (predNode: any, s: any, helperFunctions: any) => string;
            nameForGroupbyItem: (groupbyItemNormed: any) => string;
            logicformToQuestion: (logicform: any, storylineMode: any) => Promise<string>;
            getMomDate: (date: any, groupby?: any[]) => any;
            getYoyDate: (date: any) => any;
            getHierarchyCodeLength: (schema: any, name: any) => number;
            getHierarchyLevelFromCode: (schema: any, code: any) => any;
            hasDimInLogicform: (dim: string, logicform: any) => boolean;
            licenceCountDown: (days: any) => {
                restDays: number;
                licenceEndMomentDate: moment.Moment;
            };
        };
    };
    Buildins: {
        schemas: {
            Geo: {
                getSchema: () => Promise<{
                    _id: string;
                    name: string;
                    type: string;
                    completeSet: string;
                    hierarchy: {
                        name: string;
                        syno: string[];
                        code_length: number;
                    }[];
                    properties: ({
                        name: string;
                        syno: string[];
                        type: string;
                        constraints?: undefined;
                        description?: undefined;
                        is_supplementary?: undefined;
                        isArray?: undefined;
                        ui?: undefined;
                    } | {
                        name: string;
                        type: string;
                        syno?: undefined;
                        constraints?: undefined;
                        description?: undefined;
                        is_supplementary?: undefined;
                        isArray?: undefined;
                        ui?: undefined;
                    } | {
                        name: string;
                        syno: string[];
                        type: string;
                        constraints: {
                            enum: string[][];
                        };
                        description?: undefined;
                        is_supplementary?: undefined;
                        isArray?: undefined;
                        ui?: undefined;
                    } | {
                        name: string;
                        description: string;
                        is_supplementary: boolean;
                        type: string;
                        isArray: boolean;
                        ui: {
                            delimiter: string;
                        };
                        syno?: undefined;
                        constraints?: undefined;
                    })[];
                }>;
                getData: () => Promise<({
                    name: string;
                    code: string;
                    Tier?: undefined;
                } | {
                    name: string;
                    code: string;
                    Tier: string;
                })[]>;
                getSynonyms: () => Promise<{}>;
                addressToGeoLocation: (address: any, config: any) => Promise<{
                    address: any;
                    geolocation: {
                        type: string;
                        coordinates: any;
                    };
                }>;
            };
        };
    };
    SchemaUtil: {
        getHierarchyLevelFromCode: (schema: any, code: any) => any;
        findPropByName: (schema: any, propName: any, schemas: any) => any;
        QueryDefinition: typeof QueryDefinition;
    };
    getLicenseInfo: () => never;
};

export { SemanticDB as default };
