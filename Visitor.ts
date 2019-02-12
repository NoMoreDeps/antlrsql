import { TSqlParser } from "./src/grammar/TSqlParser";
import * as P from "./src/grammar/TSqlParser";
import { TSqlParserVisitor } from "./src/grammar/TSqlParserVisitor";
import { ParseTree, RuleNode, ErrorNode, TerminalNode } from "antlr4ts/tree";
import { Interval } from "antlr4ts/misc/Interval";

let hash: any = {}
let fct:any = {}
let prc:any = {};

let TABLES = [];
let STMTS  = [];

type IntervalType = {
  sourceInterval: Interval
};

type HashmapBySourcePosition<T,U> = [T,U];

function mapBySourcePosition<T extends IntervalType, U extends IntervalType>(leftParts: Array<T>, rightParts: Array<U>) : Array<HashmapBySourcePosition<T,U>> {
  let result = leftParts.sort( (a,b) => {
    return a.sourceInterval.a < b.sourceInterval.a ? 1 
      : a.sourceInterval.a === b.sourceInterval.a ? 0 
      : -1
  }).map( _ => [_]) as Array<[T,U]>; // Here we reverse the test to avoid calling reverse after the sort

  rightParts.forEach( _ => {
    result.forEach( __ => {
      if (_.sourceInterval.a > __[0].sourceInterval.a) {
        __.push(_);
      }
    })
  });
  return result;
}

function format(text: string, size: number, center: boolean) {
  text = text.trim();
  let d = size - text.length;
  let r, l = 0;

  if (d % 2 !== 0) {
    r = (d-1) / 2;
    l = r+1;  
  } else {
    r = l = d / 2;
  }

  var lstr = "";
  var rstr = "";
  for(let i=0; i<l;i++) lstr += " "; 
  for(let i=0; i<r;i++) rstr += " ";
  
  if (center) {
    return lstr + text + rstr;
  }

  return text + lstr + rstr;
}

export {
  TABLES,
  STMTS
}

function log(...args: any[]) {
  //console.log(...args);
}

function checked(context: any, rule: any) : boolean {
  if (!rule) {
    return false;
  }

  if (typeof rule === "function") {
    if (!rule.call(context)) {
      return false;
    }
  }

  return true;
}

export class Visitor implements TSqlParserVisitor<any> {

  visit(tree: ParseTree) {
    const t = tree as P.Tsql_fileContext;
    t.batch().forEach( batchContext => {
      this.visitBatch(batchContext);
    });
  }

  visitChildren(node: RuleNode) {

  }

  visitErrorNode(node: ErrorNode) {

  }

  visitTerminal(node: TerminalNode) {

  }

  visitCURRENT_USER?: (ctx: P.CURRENT_USERContext) => any;
  visitDATEADD?: (ctx: P.DATEADDContext) => any;
  visitCHECKSUM?: (ctx: P.CHECKSUMContext) => any;
  visitCURRENT_TIMESTAMP?: (ctx: P.CURRENT_TIMESTAMPContext) => any;
  visitBINARY_CHECKSUM?: (ctx: P.BINARY_CHECKSUMContext) => any;
  visitSYSTEM_USER?: (ctx: P.SYSTEM_USERContext) => any;
  visitNULLIF?: (ctx: P.NULLIFContext) => any;
  visitSESSION_USER?: (ctx: P.SESSION_USERContext) => any;
  visitCONVERT?: (ctx: P.CONVERTContext) => any;
  visitXML_DATA_TYPE_FUNC?: (ctx: P.XML_DATA_TYPE_FUNCContext) => any;
  visitCOALESCE?: (ctx: P.COALESCEContext) => any;
  visitCAST?: (ctx: P.CASTContext) => any;
  visitMIN_ACTIVE_ROWVERSION?: (ctx: P.MIN_ACTIVE_ROWVERSIONContext) => any;
  visitSCALAR_FUNCTION?: (ctx: P.SCALAR_FUNCTIONContext) => any;
  visitDATEPART?: (ctx: P.DATEPARTContext) => any;
  visitSTUFF?: (ctx: P.STUFFContext) => any;
  visitAGGREGATE_WINDOWED_FUNC?: (ctx: P.AGGREGATE_WINDOWED_FUNCContext) => any;
  visitIDENTITY?: (ctx: P.IDENTITYContext) => any;
  visitRANKING_WINDOWED_FUNC?: (ctx: P.RANKING_WINDOWED_FUNCContext) => any;
  visitDATENAME?: (ctx: P.DATENAMEContext) => any;
  visitGETUTCDATE?: (ctx: P.GETUTCDATEContext) => any;
  visitANALYTIC_WINDOWED_FUNC?: (ctx: P.ANALYTIC_WINDOWED_FUNCContext) => any;
  visitISNULL?: (ctx: P.ISNULLContext) => any;
  visitDATEDIFF?: (ctx: P.DATEDIFFContext) => any;
  visitGETDATE?: (ctx: P.GETDATEContext) => any;
  
  visitTsql_file(ctx: P.Tsql_fileContext) {
    ctx.batch().forEach( batchContext => {
      this.visitBatch(batchContext);
    });
  }

  visitBatch(ctx: P.BatchContext) {
    //ctx.execute_body()
    this.visitSql_clauses(ctx.sql_clauses())
  }

  visitSql_clauses(ctx: P.Sql_clausesContext) {
    ctx.sql_clause().forEach(sqlClauseContext => {
      this.visitSql_clause(sqlClauseContext);
    });
  }

  visitSql_clause(ctx: P.Sql_clauseContext) {
    checked(ctx, ctx.ddl_clause) 
      && this.visitDdl_clause(ctx.ddl_clause());

    checked(ctx, ctx.dml_clause) 
      && this.visitDml_clause(ctx.dml_clause());
  }

  visitDml_clause(ctx: P.Dml_clauseContext) {
    checked(ctx, ctx.insert_statement)
      && this.visitInsert_statement(ctx.insert_statement());

    checked(ctx, ctx.select_statement)
      && this.visitSelect_statement(ctx.select_statement());
  }

  visitDdl_clause(ctx: P.Ddl_clauseContext) {
    checked(ctx, ctx.create_database)
      && this.visitCreate_database(ctx.create_database());

    checked(ctx,  ctx.create_table) 
      && this.visitCreate_table(ctx.create_table());
  }

  visitBackup_statement?: (ctx: P.Backup_statementContext) => any;
  visitCfl_statement?: (ctx: P.Cfl_statementContext) => any;
  visitBlock_statement?: (ctx: P.Block_statementContext) => any;
  visitBreak_statement?: (ctx: P.Break_statementContext) => any;
  visitContinue_statement?: (ctx: P.Continue_statementContext) => any;
  visitGoto_statement?: (ctx: P.Goto_statementContext) => any;
  visitReturn_statement?: (ctx: P.Return_statementContext) => any;
  visitIf_statement?: (ctx: P.If_statementContext) => any;
  visitThrow_statement?: (ctx: P.Throw_statementContext) => any;
  visitThrow_error_number?: (ctx: P.Throw_error_numberContext) => any;
  visitThrow_message?: (ctx: P.Throw_messageContext) => any;
  visitThrow_state?: (ctx: P.Throw_stateContext) => any;
  visitTry_catch_statement?: (ctx: P.Try_catch_statementContext) => any;
  visitWaitfor_statement?: (ctx: P.Waitfor_statementContext) => any;
  visitWhile_statement?: (ctx: P.While_statementContext) => any;
  visitPrint_statement?: (ctx: P.Print_statementContext) => any;
  visitRaiseerror_statement?: (ctx: P.Raiseerror_statementContext) => any;
  visitEmpty_statement?: (ctx: P.Empty_statementContext) => any;
  visitAnother_statement?: (ctx: P.Another_statementContext) => any;
  visitAlter_application_role?: (ctx: P.Alter_application_roleContext) => any;
  visitCreate_application_role?: (ctx: P.Create_application_roleContext) => any;
  visitDrop_aggregate?: (ctx: P.Drop_aggregateContext) => any;
  visitDrop_application_role?: (ctx: P.Drop_application_roleContext) => any;
  visitAlter_assembly?: (ctx: P.Alter_assemblyContext) => any;
  visitAlter_assembly_start?: (ctx: P.Alter_assembly_startContext) => any;
  visitAlter_assembly_clause?: (ctx: P.Alter_assembly_clauseContext) => any;
  visitAlter_assembly_from_clause?: (ctx: P.Alter_assembly_from_clauseContext) => any;
  visitAlter_assembly_from_clause_start?: (ctx: P.Alter_assembly_from_clause_startContext) => any;
  visitAlter_assembly_drop_clause?: (ctx: P.Alter_assembly_drop_clauseContext) => any;
  visitAlter_assembly_drop_multiple_files?: (ctx: P.Alter_assembly_drop_multiple_filesContext) => any;
  visitAlter_assembly_drop?: (ctx: P.Alter_assembly_dropContext) => any;
  visitAlter_assembly_add_clause?: (ctx: P.Alter_assembly_add_clauseContext) => any;
  visitAlter_asssembly_add_clause_start?: (ctx: P.Alter_asssembly_add_clause_startContext) => any;
  visitAlter_assembly_client_file_clause?: (ctx: P.Alter_assembly_client_file_clauseContext) => any;
  visitAlter_assembly_file_name?: (ctx: P.Alter_assembly_file_nameContext) => any;
  visitAlter_assembly_file_bits?: (ctx: P.Alter_assembly_file_bitsContext) => any;
  visitAlter_assembly_as?: (ctx: P.Alter_assembly_asContext) => any;
  visitAlter_assembly_with_clause?: (ctx: P.Alter_assembly_with_clauseContext) => any;
  visitAlter_assembly_with?: (ctx: P.Alter_assembly_withContext) => any;
  visitClient_assembly_specifier?: (ctx: P.Client_assembly_specifierContext) => any;
  visitAssembly_option?: (ctx: P.Assembly_optionContext) => any;
  visitNetwork_file_share?: (ctx: P.Network_file_shareContext) => any;
  visitNetwork_computer?: (ctx: P.Network_computerContext) => any;
  visitNetwork_file_start?: (ctx: P.Network_file_startContext) => any;
  visitFile_path?: (ctx: P.File_pathContext) => any;
  visitFile_directory_path_separator?: (ctx: P.File_directory_path_separatorContext) => any;
  visitLocal_file?: (ctx: P.Local_fileContext) => any;
  visitLocal_drive?: (ctx: P.Local_driveContext) => any;
  visitMultiple_local_files?: (ctx: P.Multiple_local_filesContext) => any;
  visitMultiple_local_file_start?: (ctx: P.Multiple_local_file_startContext) => any;
  visitCreate_assembly?: (ctx: P.Create_assemblyContext) => any;
  visitDrop_assembly?: (ctx: P.Drop_assemblyContext) => any;
  visitAlter_asymmetric_key?: (ctx: P.Alter_asymmetric_keyContext) => any;
  visitAlter_asymmetric_key_start?: (ctx: P.Alter_asymmetric_key_startContext) => any;
  visitAsymmetric_key_option?: (ctx: P.Asymmetric_key_optionContext) => any;
  visitAsymmetric_key_option_start?: (ctx: P.Asymmetric_key_option_startContext) => any;
  visitAsymmetric_key_password_change_option?: (ctx: P.Asymmetric_key_password_change_optionContext) => any;
  visitCreate_asymmetric_key?: (ctx: P.Create_asymmetric_keyContext) => any;
  visitDrop_asymmetric_key?: (ctx: P.Drop_asymmetric_keyContext) => any;
  visitAlter_authorization?: (ctx: P.Alter_authorizationContext) => any;
  visitAuthorization_grantee?: (ctx: P.Authorization_granteeContext) => any;
  visitEntity_to?: (ctx: P.Entity_toContext) => any;
  visitColon_colon?: (ctx: P.Colon_colonContext) => any;
  visitAlter_authorization_start?: (ctx: P.Alter_authorization_startContext) => any;
  visitAlter_authorization_for_sql_database?: (ctx: P.Alter_authorization_for_sql_databaseContext) => any;
  visitAlter_authorization_for_azure_dw?: (ctx: P.Alter_authorization_for_azure_dwContext) => any;
  visitAlter_authorization_for_parallel_dw?: (ctx: P.Alter_authorization_for_parallel_dwContext) => any;
  visitClass_type?: (ctx: P.Class_typeContext) => any;
  visitClass_type_for_sql_database?: (ctx: P.Class_type_for_sql_databaseContext) => any;
  visitClass_type_for_azure_dw?: (ctx: P.Class_type_for_azure_dwContext) => any;
  visitClass_type_for_parallel_dw?: (ctx: P.Class_type_for_parallel_dwContext) => any;
  visitDrop_availability_group?: (ctx: P.Drop_availability_groupContext) => any;
  visitAlter_availability_group?: (ctx: P.Alter_availability_groupContext) => any;
  visitAlter_availability_group_start?: (ctx: P.Alter_availability_group_startContext) => any;
  visitAlter_availability_group_options?: (ctx: P.Alter_availability_group_optionsContext) => any;
  visitCreate_or_alter_broker_priority?: (ctx: P.Create_or_alter_broker_priorityContext) => any;
  visitDrop_broker_priority?: (ctx: P.Drop_broker_priorityContext) => any;
  visitAlter_certificate?: (ctx: P.Alter_certificateContext) => any;
  visitAlter_column_encryption_key?: (ctx: P.Alter_column_encryption_keyContext) => any;
  visitCreate_column_encryption_key?: (ctx: P.Create_column_encryption_keyContext) => any;
  visitDrop_certificate?: (ctx: P.Drop_certificateContext) => any;
  visitDrop_column_encryption_key?: (ctx: P.Drop_column_encryption_keyContext) => any;
  visitDrop_column_master_key?: (ctx: P.Drop_column_master_keyContext) => any;
  visitDrop_contract?: (ctx: P.Drop_contractContext) => any;
  visitDrop_credential?: (ctx: P.Drop_credentialContext) => any;
  visitDrop_cryptograhic_provider?: (ctx: P.Drop_cryptograhic_providerContext) => any;
  visitDrop_database?: (ctx: P.Drop_databaseContext) => any;
  visitDrop_database_audit_specification?: (ctx: P.Drop_database_audit_specificationContext) => any;
  visitDrop_database_scoped_credential?: (ctx: P.Drop_database_scoped_credentialContext) => any;
  visitDrop_default?: (ctx: P.Drop_defaultContext) => any;
  visitDrop_endpoint?: (ctx: P.Drop_endpointContext) => any;
  visitDrop_external_data_source?: (ctx: P.Drop_external_data_sourceContext) => any;
  visitDrop_external_file_format?: (ctx: P.Drop_external_file_formatContext) => any;
  visitDrop_external_library?: (ctx: P.Drop_external_libraryContext) => any;
  visitDrop_external_resource_pool?: (ctx: P.Drop_external_resource_poolContext) => any;
  visitDrop_external_table?: (ctx: P.Drop_external_tableContext) => any;
  visitDrop_event_notifications?: (ctx: P.Drop_event_notificationsContext) => any;
  visitDrop_event_session?: (ctx: P.Drop_event_sessionContext) => any;
  visitDrop_fulltext_catalog?: (ctx: P.Drop_fulltext_catalogContext) => any;
  visitDrop_fulltext_index?: (ctx: P.Drop_fulltext_indexContext) => any;
  visitDrop_fulltext_stoplist?: (ctx: P.Drop_fulltext_stoplistContext) => any;
  visitDrop_login?: (ctx: P.Drop_loginContext) => any;
  visitDrop_master_key?: (ctx: P.Drop_master_keyContext) => any;
  visitDrop_message_type?: (ctx: P.Drop_message_typeContext) => any;
  visitDrop_partition_function?: (ctx: P.Drop_partition_functionContext) => any;
  visitDrop_partition_scheme?: (ctx: P.Drop_partition_schemeContext) => any;
  visitDrop_queue?: (ctx: P.Drop_queueContext) => any;
  visitDrop_remote_service_binding?: (ctx: P.Drop_remote_service_bindingContext) => any;
  visitDrop_resource_pool?: (ctx: P.Drop_resource_poolContext) => any;
  visitDrop_db_role?: (ctx: P.Drop_db_roleContext) => any;
  visitDrop_route?: (ctx: P.Drop_routeContext) => any;
  visitDrop_rule?: (ctx: P.Drop_ruleContext) => any;
  visitDrop_schema?: (ctx: P.Drop_schemaContext) => any;
  visitDrop_search_property_list?: (ctx: P.Drop_search_property_listContext) => any;
  visitDrop_security_policy?: (ctx: P.Drop_security_policyContext) => any;
  visitDrop_sequence?: (ctx: P.Drop_sequenceContext) => any;
  visitDrop_server_audit?: (ctx: P.Drop_server_auditContext) => any;
  visitDrop_server_audit_specification?: (ctx: P.Drop_server_audit_specificationContext) => any;
  visitDrop_server_role?: (ctx: P.Drop_server_roleContext) => any;
  visitDrop_service?: (ctx: P.Drop_serviceContext) => any;
  visitDrop_signature?: (ctx: P.Drop_signatureContext) => any;
  visitDrop_statistics_name_azure_dw_and_pdw?: (ctx: P.Drop_statistics_name_azure_dw_and_pdwContext) => any;
  visitDrop_symmetric_key?: (ctx: P.Drop_symmetric_keyContext) => any;
  visitDrop_synonym?: (ctx: P.Drop_synonymContext) => any;
  visitDrop_user?: (ctx: P.Drop_userContext) => any;
  visitDrop_workload_group?: (ctx: P.Drop_workload_groupContext) => any;
  visitDrop_xml_schema_collection?: (ctx: P.Drop_xml_schema_collectionContext) => any;
  visitDisable_trigger?: (ctx: P.Disable_triggerContext) => any;
  visitEnable_trigger?: (ctx: P.Enable_triggerContext) => any;
  visitLock_table?: (ctx: P.Lock_tableContext) => any;
  visitTruncate_table?: (ctx: P.Truncate_tableContext) => any;
  visitCreate_column_master_key?: (ctx: P.Create_column_master_keyContext) => any;
  visitAlter_credential?: (ctx: P.Alter_credentialContext) => any;
  visitCreate_credential?: (ctx: P.Create_credentialContext) => any;
  visitAlter_cryptographic_provider?: (ctx: P.Alter_cryptographic_providerContext) => any;
  visitCreate_cryptographic_provider?: (ctx: P.Create_cryptographic_providerContext) => any;
  visitCreate_event_notification?: (ctx: P.Create_event_notificationContext) => any;
  visitCreate_or_alter_event_session?: (ctx: P.Create_or_alter_event_sessionContext) => any;
  visitEvent_session_predicate_expression?: (ctx: P.Event_session_predicate_expressionContext) => any;
  visitEvent_session_predicate_factor?: (ctx: P.Event_session_predicate_factorContext) => any;
  visitEvent_session_predicate_leaf?: (ctx: P.Event_session_predicate_leafContext) => any;
  visitAlter_external_data_source?: (ctx: P.Alter_external_data_sourceContext) => any;
  visitAlter_external_library?: (ctx: P.Alter_external_libraryContext) => any;
  visitCreate_external_library?: (ctx: P.Create_external_libraryContext) => any;
  visitAlter_external_resource_pool?: (ctx: P.Alter_external_resource_poolContext) => any;
  visitCreate_external_resource_pool?: (ctx: P.Create_external_resource_poolContext) => any;
  visitAlter_fulltext_catalog?: (ctx: P.Alter_fulltext_catalogContext) => any;
  visitCreate_fulltext_catalog?: (ctx: P.Create_fulltext_catalogContext) => any;
  visitAlter_fulltext_stoplist?: (ctx: P.Alter_fulltext_stoplistContext) => any;
  visitCreate_fulltext_stoplist?: (ctx: P.Create_fulltext_stoplistContext) => any;
  visitAlter_login_sql_server?: (ctx: P.Alter_login_sql_serverContext) => any;
  visitCreate_login_sql_server?: (ctx: P.Create_login_sql_serverContext) => any;
  visitAlter_login_azure_sql?: (ctx: P.Alter_login_azure_sqlContext) => any;
  visitCreate_login_azure_sql?: (ctx: P.Create_login_azure_sqlContext) => any;
  visitAlter_login_azure_sql_dw_and_pdw?: (ctx: P.Alter_login_azure_sql_dw_and_pdwContext) => any;
  visitCreate_login_pdw?: (ctx: P.Create_login_pdwContext) => any;
  visitAlter_master_key_sql_server?: (ctx: P.Alter_master_key_sql_serverContext) => any;
  visitCreate_master_key_sql_server?: (ctx: P.Create_master_key_sql_serverContext) => any;
  visitAlter_master_key_azure_sql?: (ctx: P.Alter_master_key_azure_sqlContext) => any;
  visitCreate_master_key_azure_sql?: (ctx: P.Create_master_key_azure_sqlContext) => any;
  visitAlter_message_type?: (ctx: P.Alter_message_typeContext) => any;
  visitAlter_partition_function?: (ctx: P.Alter_partition_functionContext) => any;
  visitAlter_partition_scheme?: (ctx: P.Alter_partition_schemeContext) => any;
  visitAlter_remote_service_binding?: (ctx: P.Alter_remote_service_bindingContext) => any;
  visitCreate_remote_service_binding?: (ctx: P.Create_remote_service_bindingContext) => any;
  visitCreate_resource_pool?: (ctx: P.Create_resource_poolContext) => any;
  visitAlter_resource_governor?: (ctx: P.Alter_resource_governorContext) => any;
  visitAlter_db_role?: (ctx: P.Alter_db_roleContext) => any;
  visitCreate_db_role?: (ctx: P.Create_db_roleContext) => any;
  visitCreate_route?: (ctx: P.Create_routeContext) => any;
  visitCreate_rule?: (ctx: P.Create_ruleContext) => any;
  visitAlter_schema_sql?: (ctx: P.Alter_schema_sqlContext) => any;
  visitCreate_schema?: (ctx: P.Create_schemaContext) => any;
  visitCreate_schema_azure_sql_dw_and_pdw?: (ctx: P.Create_schema_azure_sql_dw_and_pdwContext) => any;
  visitAlter_schema_azure_sql_dw_and_pdw?: (ctx: P.Alter_schema_azure_sql_dw_and_pdwContext) => any;
  visitCreate_search_property_list?: (ctx: P.Create_search_property_listContext) => any;
  visitCreate_security_policy?: (ctx: P.Create_security_policyContext) => any;
  visitAlter_sequence?: (ctx: P.Alter_sequenceContext) => any;
  visitCreate_sequence?: (ctx: P.Create_sequenceContext) => any;
  visitAlter_server_audit?: (ctx: P.Alter_server_auditContext) => any;
  visitCreate_server_audit?: (ctx: P.Create_server_auditContext) => any;
  visitAlter_server_audit_specification?: (ctx: P.Alter_server_audit_specificationContext) => any;
  visitCreate_server_audit_specification?: (ctx: P.Create_server_audit_specificationContext) => any;
  visitAlter_server_configuration?: (ctx: P.Alter_server_configurationContext) => any;
  visitAlter_server_role?: (ctx: P.Alter_server_roleContext) => any;
  visitCreate_server_role?: (ctx: P.Create_server_roleContext) => any;
  visitAlter_server_role_pdw?: (ctx: P.Alter_server_role_pdwContext) => any;
  visitAlter_service?: (ctx: P.Alter_serviceContext) => any;
  visitCreate_service?: (ctx: P.Create_serviceContext) => any;
  visitAlter_service_master_key?: (ctx: P.Alter_service_master_keyContext) => any;
  visitAlter_symmetric_key?: (ctx: P.Alter_symmetric_keyContext) => any;
  visitCreate_symmetric_key?: (ctx: P.Create_symmetric_keyContext) => any;
  visitCreate_synonym?: (ctx: P.Create_synonymContext) => any;
  visitAlter_user?: (ctx: P.Alter_userContext) => any;
  visitCreate_user?: (ctx: P.Create_userContext) => any;
  visitCreate_user_azure_sql_dw?: (ctx: P.Create_user_azure_sql_dwContext) => any;
  visitAlter_user_azure_sql?: (ctx: P.Alter_user_azure_sqlContext) => any;
  visitAlter_workload_group?: (ctx: P.Alter_workload_groupContext) => any;
  visitCreate_workload_group?: (ctx: P.Create_workload_groupContext) => any;
  visitCreate_xml_schema_collection?: (ctx: P.Create_xml_schema_collectionContext) => any;
  visitCreate_queue?: (ctx: P.Create_queueContext) => any;
  visitQueue_settings?: (ctx: P.Queue_settingsContext) => any;
  visitAlter_queue?: (ctx: P.Alter_queueContext) => any;
  visitQueue_action?: (ctx: P.Queue_actionContext) => any;
  visitQueue_rebuild_options?: (ctx: P.Queue_rebuild_optionsContext) => any;
  visitCreate_contract?: (ctx: P.Create_contractContext) => any;
  visitConversation_statement?: (ctx: P.Conversation_statementContext) => any;
  visitMessage_statement?: (ctx: P.Message_statementContext) => any;
  visitMerge_statement?: (ctx: P.Merge_statementContext) => any;
  visitMerge_matched?: (ctx: P.Merge_matchedContext) => any;
  visitMerge_not_matched?: (ctx: P.Merge_not_matchedContext) => any;
  visitDelete_statement?: (ctx: P.Delete_statementContext) => any;
  visitDelete_statement_from?: (ctx: P.Delete_statement_fromContext) => any;
  
  visitInsert_statement(ctx: P.Insert_statementContext) {
    let insertStm = {
      tableName : this.visitDdl_object(ctx.ddl_object())             ,
      columns   : this.visitColumn_name_list(ctx.column_name_list()) ,
      values    : this.visitInsert_statement_value(ctx.insert_statement_value())
    };

    STMTS.push(insertStm);
  }

  visitInsert_statement_value(ctx: P.Insert_statement_valueContext) {
    return this.visitTable_value_constructor(ctx.table_value_constructor());
  }

  visitReceive_statement?: (ctx: P.Receive_statementContext) => any;
  visitSelect_statement(ctx: P.Select_statementContext) {
    let insert = STMTS[0];
    let sep = "";
    for(let i=0;i<66;i++) {
      sep += "-"
    }
    console.log(`TABLE : ${insert.tableName.table}`);
    console.log(sep)
    console.log("|", insert.columns.map(e => format(e, 10, true)).join(" | "), "|");
    console.log(sep)
    insert.values.forEach(v => {
      console.log("|", v.map(e => format(e, 10, false)).join(" | "), "|");
    })
  }
  visitTime?: (ctx: P.TimeContext) => any;
  visitUpdate_statement?: (ctx: P.Update_statementContext) => any;
  visitOutput_clause?: (ctx: P.Output_clauseContext) => any;
  visitOutput_dml_list_elem?: (ctx: P.Output_dml_list_elemContext) => any;
  visitOutput_column_name?: (ctx: P.Output_column_nameContext) => any;
  
  visitCreate_database(ctx: P.Create_databaseContext) {
    const id = this.visitId(ctx.id()[0]);
    const isPrimary = !!ctx.PRIMARY;
  
    let onInterval = 0;
    let logInterval = 0;

    if (ctx.ON(0)) {
      onInterval = ctx.ON(0).sourceInterval.b;
    }

    if (ctx.ON(1)) {
      logInterval = ctx.ON(1).sourceInterval.b;
    }

    let onFiles  = [];
    let logFiles = [];

    ctx.database_file_spec().forEach( fs => {
      if(logInterval && fs.sourceInterval.a > logInterval) {
        logFiles.push(this.visitDatabase_file_spec(fs));
      } else {
        onFiles.push(this.visitDatabase_file_spec(fs));
      }
    });

    const collate = this.visitId(ctx._collation_name);

    const _with = ctx.create_database_option().map( m => m);

    console.log(`
      Database id : ${id}
      isPrimary   : ${isPrimary}
      
      On Filestream  : ${onFiles}
      Log Filestream : ${logFiles}
      
      Collate : ${collate}
      With    : ${_with}
    `);
    
  }

  visitCreate_index?: (ctx: P.Create_indexContext) => any;
  visitCreate_or_alter_procedure?: (ctx: P.Create_or_alter_procedureContext) => any;
  visitCreate_or_alter_trigger?: (ctx: P.Create_or_alter_triggerContext) => any;
  visitCreate_or_alter_dml_trigger?: (ctx: P.Create_or_alter_dml_triggerContext) => any;
  visitDml_trigger_option?: (ctx: P.Dml_trigger_optionContext) => any;
  visitDml_trigger_operation?: (ctx: P.Dml_trigger_operationContext) => any;
  visitCreate_or_alter_ddl_trigger?: (ctx: P.Create_or_alter_ddl_triggerContext) => any;
  visitDdl_trigger_operation?: (ctx: P.Ddl_trigger_operationContext) => any;
  visitCreate_or_alter_function?: (ctx: P.Create_or_alter_functionContext) => any;
  visitFunc_body_returns_select?: (ctx: P.Func_body_returns_selectContext) => any;
  visitFunc_body_returns_table?: (ctx: P.Func_body_returns_tableContext) => any;
  visitFunc_body_returns_scalar?: (ctx: P.Func_body_returns_scalarContext) => any;
  visitProcedure_param?: (ctx: P.Procedure_paramContext) => any;
  visitProcedure_option?: (ctx: P.Procedure_optionContext) => any;
  visitFunction_option?: (ctx: P.Function_optionContext) => any;
  visitCreate_statistics?: (ctx: P.Create_statisticsContext) => any;
  visitUpdate_statistics?: (ctx: P.Update_statisticsContext) => any;
  
  visitCreate_table(ctx: P.Create_tableContext) {
    log(`enterCreate table`);
    const tableName = this.visitTable_name(ctx.table_name());
    const columnDef = this.visitColumn_def_table_constraints(ctx.column_def_table_constraints());

    TABLES.push({
      tableName,
      columnDef
    });
  }
  
  visitTable_options?: (ctx: P.Table_optionsContext) => any;
  visitCreate_view?: (ctx: P.Create_viewContext) => any;
  visitView_attribute?: (ctx: P.View_attributeContext) => any;
  visitAlter_table?: (ctx: P.Alter_tableContext) => any;
  visitAlter_database?: (ctx: P.Alter_databaseContext) => any;
  visitDatabase_optionspec?: (ctx: P.Database_optionspecContext) => any;
  visitAuto_option?: (ctx: P.Auto_optionContext) => any;
  visitChange_tracking_option?: (ctx: P.Change_tracking_optionContext) => any;
  visitChange_tracking_option_list?: (ctx: P.Change_tracking_option_listContext) => any;
  visitContainment_option?: (ctx: P.Containment_optionContext) => any;
  visitCursor_option?: (ctx: P.Cursor_optionContext) => any;
  visitAlter_endpoint?: (ctx: P.Alter_endpointContext) => any;
  visitDatabase_mirroring_option?: (ctx: P.Database_mirroring_optionContext) => any;
  visitMirroring_set_option?: (ctx: P.Mirroring_set_optionContext) => any;
  visitMirroring_partner?: (ctx: P.Mirroring_partnerContext) => any;
  visitMirroring_witness?: (ctx: P.Mirroring_witnessContext) => any;
  visitWitness_partner_equal?: (ctx: P.Witness_partner_equalContext) => any;
  visitPartner_option?: (ctx: P.Partner_optionContext) => any;
  visitWitness_option?: (ctx: P.Witness_optionContext) => any;
  visitWitness_server?: (ctx: P.Witness_serverContext) => any;
  visitPartner_server?: (ctx: P.Partner_serverContext) => any;
  visitMirroring_host_port_seperator?: (ctx: P.Mirroring_host_port_seperatorContext) => any;
  visitPartner_server_tcp_prefix?: (ctx: P.Partner_server_tcp_prefixContext) => any;
  visitPort_number?: (ctx: P.Port_numberContext) => any;
  visitHost?: (ctx: P.HostContext) => any;
  visitDate_correlation_optimization_option?: (ctx: P.Date_correlation_optimization_optionContext) => any;
  visitDb_encryption_option?: (ctx: P.Db_encryption_optionContext) => any;
  visitDb_state_option?: (ctx: P.Db_state_optionContext) => any;
  visitDb_update_option?: (ctx: P.Db_update_optionContext) => any;
  visitDb_user_access_option?: (ctx: P.Db_user_access_optionContext) => any;
  visitDelayed_durability_option?: (ctx: P.Delayed_durability_optionContext) => any;
  visitExternal_access_option?: (ctx: P.External_access_optionContext) => any;
  visitHadr_options?: (ctx: P.Hadr_optionsContext) => any;
  visitMixed_page_allocation_option?: (ctx: P.Mixed_page_allocation_optionContext) => any;
  visitParameterization_option?: (ctx: P.Parameterization_optionContext) => any;
  visitRecovery_option?: (ctx: P.Recovery_optionContext) => any;
  visitService_broker_option?: (ctx: P.Service_broker_optionContext) => any;
  visitSnapshot_option?: (ctx: P.Snapshot_optionContext) => any;
  visitSql_option?: (ctx: P.Sql_optionContext) => any;
  visitTarget_recovery_time_option?: (ctx: P.Target_recovery_time_optionContext) => any;
  visitTermination?: (ctx: P.TerminationContext) => any;
  visitDrop_index?: (ctx: P.Drop_indexContext) => any;
  visitDrop_relational_or_xml_or_spatial_index?: (ctx: P.Drop_relational_or_xml_or_spatial_indexContext) => any;
  visitDrop_backward_compatible_index?: (ctx: P.Drop_backward_compatible_indexContext) => any;
  visitDrop_procedure?: (ctx: P.Drop_procedureContext) => any;
  visitDrop_trigger?: (ctx: P.Drop_triggerContext) => any;
  visitDrop_dml_trigger?: (ctx: P.Drop_dml_triggerContext) => any;
  visitDrop_ddl_trigger?: (ctx: P.Drop_ddl_triggerContext) => any;
  visitDrop_function?: (ctx: P.Drop_functionContext) => any;
  visitDrop_statistics?: (ctx: P.Drop_statisticsContext) => any;
  visitDrop_table?: (ctx: P.Drop_tableContext) => any;
  visitDrop_view?: (ctx: P.Drop_viewContext) => any;
  visitCreate_type?: (ctx: P.Create_typeContext) => any;
  visitDrop_type?: (ctx: P.Drop_typeContext) => any;
  visitRowset_function_limited?: (ctx: P.Rowset_function_limitedContext) => any;
  visitOpenquery?: (ctx: P.OpenqueryContext) => any;
  visitOpendatasource?: (ctx: P.OpendatasourceContext) => any;
  visitDeclare_statement?: (ctx: P.Declare_statementContext) => any;
  visitCursor_statement?: (ctx: P.Cursor_statementContext) => any;
  visitBackup_database?: (ctx: P.Backup_databaseContext) => any;
  visitBackup_log?: (ctx: P.Backup_logContext) => any;
  visitBackup_certificate?: (ctx: P.Backup_certificateContext) => any;
  visitBackup_master_key?: (ctx: P.Backup_master_keyContext) => any;
  visitBackup_service_master_key?: (ctx: P.Backup_service_master_keyContext) => any;
  visitExecute_statement?: (ctx: P.Execute_statementContext) => any;
  visitExecute_body?: (ctx: P.Execute_bodyContext) => any;
  visitExecute_statement_arg?: (ctx: P.Execute_statement_argContext) => any;
  visitExecute_var_string?: (ctx: P.Execute_var_stringContext) => any;
  visitSecurity_statement?: (ctx: P.Security_statementContext) => any;
  visitCreate_certificate?: (ctx: P.Create_certificateContext) => any;
  visitExisting_keys?: (ctx: P.Existing_keysContext) => any;
  visitPrivate_key_options?: (ctx: P.Private_key_optionsContext) => any;
  visitGenerate_new_keys?: (ctx: P.Generate_new_keysContext) => any;
  visitDate_options?: (ctx: P.Date_optionsContext) => any;
  visitOpen_key?: (ctx: P.Open_keyContext) => any;
  visitClose_key?: (ctx: P.Close_keyContext) => any;
  visitCreate_key?: (ctx: P.Create_keyContext) => any;
  visitKey_options?: (ctx: P.Key_optionsContext) => any;
  visitAlgorithm?: (ctx: P.AlgorithmContext) => any;
  visitEncryption_mechanism?: (ctx: P.Encryption_mechanismContext) => any;
  visitDecryption_mechanism?: (ctx: P.Decryption_mechanismContext) => any;
  visitGrant_permission?: (ctx: P.Grant_permissionContext) => any;
  visitSet_statement?: (ctx: P.Set_statementContext) => any;
  visitTransaction_statement?: (ctx: P.Transaction_statementContext) => any;
  visitGo_statement?: (ctx: P.Go_statementContext) => any;
  visitUse_statement?: (ctx: P.Use_statementContext) => any;
  visitSetuser_statement?: (ctx: P.Setuser_statementContext) => any;
  visitDbcc_clause?: (ctx: P.Dbcc_clauseContext) => any;
  visitDbcc_options?: (ctx: P.Dbcc_optionsContext) => any;
  visitExecute_clause?: (ctx: P.Execute_clauseContext) => any;
  visitDeclare_local?: (ctx: P.Declare_localContext) => any;
  visitTable_type_definition?: (ctx: P.Table_type_definitionContext) => any;
  visitXml_type_definition?: (ctx: P.Xml_type_definitionContext) => any;
  visitXml_schema_collection?: (ctx: P.Xml_schema_collectionContext) => any;

  visitColumn_def_table_constraints(ctx: P.Column_def_table_constraintsContext) {
    if (!ctx) return;
    let tableConstraints = [];

    ctx.column_def_table_constraint().forEach( context => {
      tableConstraints.push(this.visitColumn_def_table_constraint(context));
    });

    return tableConstraints;
  };

  visitColumn_def_table_constraint(ctx: P.Column_def_table_constraintContext) {
    const columnDef =  this.visitColumn_definition(ctx.column_definition());
    return columnDef;
  }

  visitColumn_definition(ctx: P.Column_definitionContext) {
    const id = this.visitId(ctx.id()[0]);
    const dataType = this.visitData_type(ctx.data_type());

    return {
      id,
      dataType
    };
  }

  visitMaterialized_column_definition?: (ctx: P.Materialized_column_definitionContext) => any;
  visitColumn_constraint?: (ctx: P.Column_constraintContext) => any;
  visitTable_constraint?: (ctx: P.Table_constraintContext) => any;
  visitOn_delete?: (ctx: P.On_deleteContext) => any;
  visitOn_update?: (ctx: P.On_updateContext) => any;
  visitIndex_options?: (ctx: P.Index_optionsContext) => any;
  visitIndex_option?: (ctx: P.Index_optionContext) => any;
  visitDeclare_cursor?: (ctx: P.Declare_cursorContext) => any;
  visitDeclare_set_cursor_common?: (ctx: P.Declare_set_cursor_commonContext) => any;
  visitDeclare_set_cursor_common_partial?: (ctx: P.Declare_set_cursor_common_partialContext) => any;
  visitFetch_cursor?: (ctx: P.Fetch_cursorContext) => any;
  visitSet_special?: (ctx: P.Set_specialContext) => any;
  visitConstant_LOCAL_ID?: (ctx: P.Constant_LOCAL_IDContext) => any;
  
  visitExpression (ctx: P.ExpressionContext) {    
    if (checked(ctx, ctx.primitive_expression)) {
      return this.visitPrimitive_expression(ctx.primitive_expression());
    }
  }

  visitPrimitive_expression(ctx: P.Primitive_expressionContext) {
    let result = "";

    if (checked(ctx, ctx.constant)) {
      result = ctx.constant().text;
    }

    return result;
  }

  visitCase_expression?: (ctx: P.Case_expressionContext) => any;
  visitUnary_operator_expression?: (ctx: P.Unary_operator_expressionContext) => any;
  visitBracket_expression?: (ctx: P.Bracket_expressionContext) => any;
  visitConstant_expression?: (ctx: P.Constant_expressionContext) => any;
  visitSubquery?: (ctx: P.SubqueryContext) => any;
  visitWith_expression?: (ctx: P.With_expressionContext) => any;
  visitCommon_table_expression?: (ctx: P.Common_table_expressionContext) => any;
  visitUpdate_elem?: (ctx: P.Update_elemContext) => any;
  visitSearch_condition_list?: (ctx: P.Search_condition_listContext) => any;
  visitSearch_condition?: (ctx: P.Search_conditionContext) => any;
  visitSearch_condition_and?: (ctx: P.Search_condition_andContext) => any;
  visitSearch_condition_not?: (ctx: P.Search_condition_notContext) => any;
  visitPredicate?: (ctx: P.PredicateContext) => any;
  visitQuery_expression?: (ctx: P.Query_expressionContext) => any;
  visitSql_union?: (ctx: P.Sql_unionContext) => any;
  visitQuery_specification?: (ctx: P.Query_specificationContext) => any;
  visitTop_clause?: (ctx: P.Top_clauseContext) => any;
  visitTop_percent?: (ctx: P.Top_percentContext) => any;
  visitTop_count?: (ctx: P.Top_countContext) => any;
  visitOrder_by_clause?: (ctx: P.Order_by_clauseContext) => any;
  visitFor_clause?: (ctx: P.For_clauseContext) => any;
  visitXml_common_directives?: (ctx: P.Xml_common_directivesContext) => any;
  visitOrder_by_expression?: (ctx: P.Order_by_expressionContext) => any;
  visitGroup_by_item?: (ctx: P.Group_by_itemContext) => any;
  visitOption_clause?: (ctx: P.Option_clauseContext) => any;
  visitOption?: (ctx: P.OptionContext) => any;
  visitOptimize_for_arg?: (ctx: P.Optimize_for_argContext) => any;
  visitSelect_list?: (ctx: P.Select_listContext) => any;
  visitUdt_method_arguments?: (ctx: P.Udt_method_argumentsContext) => any;
  visitAsterisk?: (ctx: P.AsteriskContext) => any;
  visitColumn_elem?: (ctx: P.Column_elemContext) => any;
  visitUdt_elem?: (ctx: P.Udt_elemContext) => any;
  visitExpression_elem?: (ctx: P.Expression_elemContext) => any;
  visitSelect_list_elem?: (ctx: P.Select_list_elemContext) => any;
  visitTable_sources?: (ctx: P.Table_sourcesContext) => any;
  visitTable_source?: (ctx: P.Table_sourceContext) => any;
  visitTable_source_item_joined?: (ctx: P.Table_source_item_joinedContext) => any;
  visitTable_source_item?: (ctx: P.Table_source_itemContext) => any;
  visitOpen_xml?: (ctx: P.Open_xmlContext) => any;
  visitSchema_declaration?: (ctx: P.Schema_declarationContext) => any;
  visitColumn_declaration?: (ctx: P.Column_declarationContext) => any;
  visitChange_table?: (ctx: P.Change_tableContext) => any;
  visitJoin_part?: (ctx: P.Join_partContext) => any;
  visitPivot_clause?: (ctx: P.Pivot_clauseContext) => any;
  visitUnpivot_clause?: (ctx: P.Unpivot_clauseContext) => any;
  visitFull_column_name_list?: (ctx: P.Full_column_name_listContext) => any;
  visitTable_name_with_hint?: (ctx: P.Table_name_with_hintContext) => any;
  visitRowset_function?: (ctx: P.Rowset_functionContext) => any;
  visitBulk_option?: (ctx: P.Bulk_optionContext) => any;
  visitDerived_table?: (ctx: P.Derived_tableContext) => any;
  visitFunction_call?: (ctx: P.Function_callContext) => any;
  visitXml_data_type_methods?: (ctx: P.Xml_data_type_methodsContext) => any;
  visitValue_method?: (ctx: P.Value_methodContext) => any;
  visitQuery_method?: (ctx: P.Query_methodContext) => any;
  visitExist_method?: (ctx: P.Exist_methodContext) => any;
  visitModify_method?: (ctx: P.Modify_methodContext) => any;
  visitNodes_method?: (ctx: P.Nodes_methodContext) => any;
  visitSwitch_section?: (ctx: P.Switch_sectionContext) => any;
  visitSwitch_search_condition_section?: (ctx: P.Switch_search_condition_sectionContext) => any;
  visitAs_column_alias?: (ctx: P.As_column_aliasContext) => any;
  visitAs_table_alias?: (ctx: P.As_table_aliasContext) => any;
  visitTable_alias?: (ctx: P.Table_aliasContext) => any;
  visitWith_table_hints?: (ctx: P.With_table_hintsContext) => any;
  visitInsert_with_table_hints?: (ctx: P.Insert_with_table_hintsContext) => any;
  visitTable_hint?: (ctx: P.Table_hintContext) => any;
  visitIndex_value?: (ctx: P.Index_valueContext) => any;
  visitColumn_alias_list?: (ctx: P.Column_alias_listContext) => any;
  visitColumn_alias?: (ctx: P.Column_aliasContext) => any;
  
  visitTable_value_constructor(ctx: P.Table_value_constructorContext) {
    let lines = [];

    ctx.expression_list().forEach( expList => {
     lines.push(this.visitExpression_list(expList));
    });

    return lines;
  }

  visitExpression_list(ctx: P.Expression_listContext) {
    let exps = [];

    ctx.expression().forEach( exp => {
      exps.push(this.visitExpression(exp));
    });

    return exps;
  }

  visitRanking_windowed_function?: (ctx: P.Ranking_windowed_functionContext) => any;
  visitAggregate_windowed_function?: (ctx: P.Aggregate_windowed_functionContext) => any;
  visitAnalytic_windowed_function?: (ctx: P.Analytic_windowed_functionContext) => any;
  visitAll_distinct_expression?: (ctx: P.All_distinct_expressionContext) => any;
  visitOver_clause?: (ctx: P.Over_clauseContext) => any;
  visitRow_or_range_clause?: (ctx: P.Row_or_range_clauseContext) => any;
  visitWindow_frame_extent?: (ctx: P.Window_frame_extentContext) => any;
  visitWindow_frame_bound?: (ctx: P.Window_frame_boundContext) => any;
  visitWindow_frame_preceding?: (ctx: P.Window_frame_precedingContext) => any;
  visitWindow_frame_following?: (ctx: P.Window_frame_followingContext) => any;
  visitCreate_database_option?: (ctx: P.Create_database_optionContext) => any;
  visitDatabase_filestream_option?: (ctx: P.Database_filestream_optionContext) => any;
  
  visitDatabase_file_spec(ctx: P.Database_file_specContext) {
    if(checked(ctx, ctx.file_group)) {
      return this.visitFile_group(ctx.file_group());
    }

    if(checked(ctx, ctx.file_spec)) {
      return this.visitFile_spec(ctx.file_spec());
    }
  }

  visitFile_group(ctx: P.File_groupContext) {
    const id = this.visitId(ctx.id());
    const filestream = checked(ctx, ctx.FILESTREAM);
    const _default = checked(ctx, ctx.DEFAULT);
    const memoryOptimizedData = checked(ctx, ctx.MEMORY_OPTIMIZED_DATA);
    let fileSpecs = (checked(ctx, ctx.file_spec()) 
      && ctx.file_spec().map( _ => this.visitFile_spec(_))) 
      || [];
      return {
        id,
        filestream,
        _default,
        memoryOptimizedData,
        fileSpecs
      };
  }

  visitFile_spec(ctx: P.File_specContext) {
    let name = "";
    let filename = "";

    if (checked(ctx, ctx.id())) {
      name = this.visitId(ctx.id());
    } 
    
    if (checked(ctx, ctx.STRING)) {
      ctx.STRING().forEach( _ => {
        if (_.sourceInterval.a > ctx.FILENAME().sourceInterval.b) {
          filename = _.text;
        } else {
          name = _.text;
        }
      });
    }

    let tabSize = [];
    
    checked(ctx, ctx.SIZE) && (tabSize.push(ctx.SIZE()));
    checked(ctx, ctx.MAXSIZE) && (tabSize.push(ctx.MAXSIZE()));
    checked(ctx, ctx.FILEGROWTH) && (tabSize.push(ctx.FILEGROWTH()));

    if(tabSize.length > 0) {

    }
  }

  visitEntity_name?: (ctx: P.Entity_nameContext) => any;
  visitEntity_name_for_azure_dw?: (ctx: P.Entity_name_for_azure_dwContext) => any;
  visitEntity_name_for_parallel_dw?: (ctx: P.Entity_name_for_parallel_dwContext) => any;
  
  visitFull_table_name(ctx: P.Full_table_nameContext) {
    log("visitFull_table_name")
    const tableDef =  {
      server   : this.visitId(ctx._server)   ,
      database : this.visitId(ctx._database) ,
      schema   : this.visitId(ctx._schema)   ,
      table    : this.visitId(ctx._table)    
    };

    //console.log(tableDef);
    return tableDef;
  }

  visitTable_name(ctx: P.Table_nameContext) {
    log("visitTable_name")
    const tableDef =  {
      database : this.visitId(ctx._database) ,
      schema   : this.visitId(ctx._schema)   ,
      table    : this.visitId(ctx._table)    
    };

    //console.log(tableDef);
    return tableDef;
  }
  
  visitSimple_name?: (ctx: P.Simple_nameContext) => any;
  visitFunc_proc_name?: (ctx: P.Func_proc_nameContext) => any;

  visitDdl_object(ctx: P.Ddl_objectContext) {
    if (checked(ctx, ctx.full_table_name)) {
      return this.visitFull_table_name(ctx.full_table_name());
    }
  }

  visitFull_column_name?: (ctx: P.Full_column_nameContext) => any;
  visitColumn_name_list_with_order?: (ctx: P.Column_name_list_with_orderContext) => any;
  
  visitColumn_name_list(ctx: P.Column_name_listContext) {
    let ids = [];
    ctx.id().forEach( id => {
      ids.push(this.visitId(id));
    });
    return ids;
  }

  visitCursor_name?: (ctx: P.Cursor_nameContext) => any;
  visitOn_off?: (ctx: P.On_offContext) => any;
  visitClustered?: (ctx: P.ClusteredContext) => any;
  visitNull_notnull?: (ctx: P.Null_notnullContext) => any;
  visitNull_or_default?: (ctx: P.Null_or_defaultContext) => any;
  visitScalar_function_name?: (ctx: P.Scalar_function_nameContext) => any;
  visitBegin_conversation_timer?: (ctx: P.Begin_conversation_timerContext) => any;
  visitBegin_conversation_dialog?: (ctx: P.Begin_conversation_dialogContext) => any;
  visitContract_name?: (ctx: P.Contract_nameContext) => any;
  visitService_name?: (ctx: P.Service_nameContext) => any;
  visitEnd_conversation?: (ctx: P.End_conversationContext) => any;
  visitWaitfor_conversation?: (ctx: P.Waitfor_conversationContext) => any;
  visitGet_conversation?: (ctx: P.Get_conversationContext) => any;
  visitQueue_id?: (ctx: P.Queue_idContext) => any;
  visitSend_conversation?: (ctx: P.Send_conversationContext) => any;
  visitData_type(ctx: P.Data_typeContext) {
    let type = {
      par       : (ctx.DECIMAL()  && ctx.DECIMAL().join("")) || (ctx.MAX() && ctx.MAX().text),
      id        : ctx.id          && this.visitId(ctx.id()) ,
      double    : ctx.DOUBLE()    && ctx.DOUBLE().text      ,
      precision : ctx.PRECISION() && ctx.PRECISION().text   ,
      int       : ctx.INT()       && ctx.INT().text         ,
      smallInt  : ctx.SMALLINT()  && ctx.SMALLINT().text    ,
      bigint    : ctx.BIGINT()    && ctx.BIGINT().text
    };
    
    log(`dataType`, type)
    return type;
  }
  visitDefault_value?: (ctx: P.Default_valueContext) => any;
  visitConstant?: (ctx: P.ConstantContext) => any;
  visitSign?: (ctx: P.SignContext) => any;
  visitId(ctx: P.IdContext) {
    if (!ctx) return;

    if (checked(ctx, ctx.simple_id)) {
      log("simple_id", ctx.simple_id().text)
      return ctx.simple_id().text;
    }

    if (checked(ctx, ctx.DOUBLE_QUOTE_ID)) {
      log("DOUBLE_QUOTE_ID", ctx.DOUBLE_QUOTE_ID().text)
      return ctx.DOUBLE_QUOTE_ID().text;
    }

    if (checked(ctx, ctx.SQUARE_BRACKET_ID)) {
      log("SQUARE_BRACKET_ID", ctx.SQUARE_BRACKET_ID().text)
      return ctx.SQUARE_BRACKET_ID().text;
    }

    return ctx.text;
  }
  visitSimple_id?: (ctx: P.Simple_idContext) => any;
  visitComparison_operator?: (ctx: P.Comparison_operatorContext) => any;
  visitAssignment_operator?: (ctx: P.Assignment_operatorContext) => any;
  
  visitFile_size(ctx: P.File_sizeContext) {
    let unit = checked(ctx, ctx.KB) && ctx.KB().text;
    checked(ctx, ctx.MB) && (unit = ctx.MB().text);
    checked(ctx, ctx.GB) && (unit = ctx.GB().text);
    checked(ctx, ctx.TB) && (unit = ctx.TB().text);
    ctx.text.indexOf("%") > -1 && (unit = "%");

    return {
      decimal: ctx.DECIMAL().text,
      unit
    }
  }

  private parser: TSqlParser;

  constructor(parser: TSqlParser) {
    this.parser = parser;
  }

  
}

export {
  hash,
  prc,
  fct
}