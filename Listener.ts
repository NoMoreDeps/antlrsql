import {TSqlParserListener} from "./src/grammar/TSqlParserListener";
import { TSqlParser } from "./src/grammar/TSqlParser";
import * as P from "./src/grammar/TSqlParser";

let hash: any = {}
let fct:any = {}
let prc:any = {};


export class Listener implements TSqlParserListener {
  private parser: TSqlParser;

  constructor(parser: TSqlParser) {
    this.parser = parser;
  }

  enterTable_name(ctx: P.Table_nameContext) {
    if (!hash[ctx.text]) {
      hash[ctx.text] = {};
    }
    hash[ctx.text].schema = ctx._schema.text;
    hash[ctx.text].table = ctx._table.text;
  }

  enterAs_table_alias(ctx: P.As_table_aliasContext) {
    const p = ctx.parent as P.Table_source_itemContext;
    const tableName = p.table_name_with_hint().table_name().text;

    if (!hash[tableName]) {
      hash[tableName] = {};
    }
    hash[tableName].alias = ctx.table_alias().text;
  };

  enterExecute_body(ctx: P.Execute_bodyContext) {
    const localId = ctx.LOCAL_ID() && ctx.LOCAL_ID().text || "";
    const name = ctx.func_proc_name().text;

    if (localId) {
      prc[name] = {};
    } else {
      fct[name] = {};
    }
  }
}

export {
  hash,
  prc,
  fct
}