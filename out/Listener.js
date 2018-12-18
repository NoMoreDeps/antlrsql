"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let hash = {};
exports.hash = hash;
let fct = {};
exports.fct = fct;
let prc = {};
exports.prc = prc;
class Listener {
    constructor(parser) {
        this.parser = parser;
    }
    enterTable_name(ctx) {
        if (!hash[ctx.text]) {
            hash[ctx.text] = {};
        }
        hash[ctx.text].schema = ctx._schema.text;
        hash[ctx.text].table = ctx._table.text;
    }
    enterAs_table_alias(ctx) {
        const p = ctx.parent;
        const tableName = p.table_name_with_hint().table_name().text;
        if (!hash[tableName]) {
            hash[tableName] = {};
        }
        hash[tableName].alias = ctx.table_alias().text;
    }
    ;
    enterExecute_body(ctx) {
        const localId = ctx.LOCAL_ID() && ctx.LOCAL_ID().text || "";
        const name = ctx.func_proc_name().text;
        if (localId) {
            prc[name] = {};
        }
        else {
            fct[name] = {};
        }
    }
}
exports.Listener = Listener;
