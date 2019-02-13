"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let hash = {};
exports.hash = hash;
let fct = {};
exports.fct = fct;
let prc = {};
exports.prc = prc;
let TABLES = [];
exports.TABLES = TABLES;
let STMTS = [];
exports.STMTS = STMTS;
function mapBySourcePosition(leftParts, rightParts) {
    let result = leftParts.sort((a, b) => {
        return a.sourceInterval.a < b.sourceInterval.a ? 1
            : a.sourceInterval.a === b.sourceInterval.a ? 0
                : -1;
    }).map(_ => [_]); // Here we reverse the test to avoid calling reverse after the sort
    rightParts.forEach(_ => {
        let found = false;
        result.forEach(__ => {
            if (!found && _.sourceInterval.a >= __[0].sourceInterval.b) {
                __.push(_);
                found = true;
            }
        });
    });
    return result;
}
function format(text, size, center) {
    text = text.trim();
    let d = size - text.length;
    let r, l = 0;
    if (d % 2 !== 0) {
        r = (d - 1) / 2;
        l = r + 1;
    }
    else {
        r = l = d / 2;
    }
    var lstr = "";
    var rstr = "";
    for (let i = 0; i < l; i++)
        lstr += " ";
    for (let i = 0; i < r; i++)
        rstr += " ";
    if (center) {
        return lstr + text + rstr;
    }
    return text + lstr + rstr;
}
function log(...args) {
    //console.log(...args);
}
function checked(context, rule) {
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
class Visitor {
    visit(tree) {
        const t = tree;
        t.batch().forEach(batchContext => {
            this.visitBatch(batchContext);
        });
    }
    visitChildren(node) {
    }
    visitErrorNode(node) {
    }
    visitTerminal(node) {
    }
    visitTsql_file(ctx) {
        ctx.batch().forEach(batchContext => {
            this.visitBatch(batchContext);
        });
    }
    visitBatch(ctx) {
        //ctx.execute_body()
        this.visitSql_clauses(ctx.sql_clauses());
    }
    visitSql_clauses(ctx) {
        ctx.sql_clause().forEach(sqlClauseContext => {
            this.visitSql_clause(sqlClauseContext);
        });
    }
    visitSql_clause(ctx) {
        checked(ctx, ctx.ddl_clause)
            && this.visitDdl_clause(ctx.ddl_clause());
        checked(ctx, ctx.dml_clause)
            && this.visitDml_clause(ctx.dml_clause());
    }
    visitDml_clause(ctx) {
        checked(ctx, ctx.insert_statement)
            && this.visitInsert_statement(ctx.insert_statement());
        checked(ctx, ctx.select_statement)
            && this.visitSelect_statement(ctx.select_statement());
    }
    visitDdl_clause(ctx) {
        checked(ctx, ctx.create_database)
            && this.visitCreate_database(ctx.create_database());
        checked(ctx, ctx.create_table)
            && this.visitCreate_table(ctx.create_table());
    }
    visitInsert_statement(ctx) {
        let insertStm = {
            tableName: this.visitDdl_object(ctx.ddl_object()),
            columns: this.visitColumn_name_list(ctx.column_name_list()),
            values: this.visitInsert_statement_value(ctx.insert_statement_value())
        };
        STMTS.push(insertStm);
    }
    visitInsert_statement_value(ctx) {
        return this.visitTable_value_constructor(ctx.table_value_constructor());
    }
    visitSelect_statement(ctx) {
        let insert = STMTS[0];
        let sep = "";
        for (let i = 0; i < 66; i++) {
            sep += "-";
        }
        console.log(`TABLE : ${insert.tableName.table}`);
        console.log(sep);
        console.log("|", insert.columns.map(e => format(e, 10, true)).join(" | "), "|");
        console.log(sep);
        insert.values.forEach(v => {
            console.log("|", v.map(e => format(e, 10, false)).join(" | "), "|");
        });
    }
    visitCreate_database(ctx) {
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
        let onFiles = [];
        let logFiles = [];
        ctx.database_file_spec().forEach(fs => {
            if (logInterval && fs.sourceInterval.a > logInterval) {
                logFiles.push(this.visitDatabase_file_spec(fs));
            }
            else {
                onFiles.push(this.visitDatabase_file_spec(fs));
            }
        });
        const collate = this.visitId(ctx._collation_name);
        const _with = ctx.create_database_option().map(m => m);
        console.log(`
      Database id : ${id}
      isPrimary   : ${isPrimary}
      
      On Filestream  : ${onFiles}
      Log Filestream : ${logFiles}
      
      Collate : ${collate}
      With    : ${_with}
    `);
    }
    visitCreate_table(ctx) {
        log(`enterCreate table`);
        const tableName = this.visitTable_name(ctx.table_name());
        const columnDef = this.visitColumn_def_table_constraints(ctx.column_def_table_constraints());
        TABLES.push({
            tableName,
            columnDef
        });
    }
    visitColumn_def_table_constraints(ctx) {
        if (!ctx)
            return;
        let tableConstraints = [];
        ctx.column_def_table_constraint().forEach(context => {
            tableConstraints.push(this.visitColumn_def_table_constraint(context));
        });
        return tableConstraints;
    }
    ;
    visitColumn_def_table_constraint(ctx) {
        const columnDef = this.visitColumn_definition(ctx.column_definition());
        return columnDef;
    }
    visitColumn_definition(ctx) {
        const id = this.visitId(ctx.id()[0]);
        const dataType = this.visitData_type(ctx.data_type());
        return {
            id,
            dataType
        };
    }
    visitExpression(ctx) {
        if (checked(ctx, ctx.primitive_expression)) {
            return this.visitPrimitive_expression(ctx.primitive_expression());
        }
    }
    visitPrimitive_expression(ctx) {
        let result = "";
        if (checked(ctx, ctx.constant)) {
            result = ctx.constant().text;
        }
        return result;
    }
    visitTable_value_constructor(ctx) {
        let lines = [];
        ctx.expression_list().forEach(expList => {
            lines.push(this.visitExpression_list(expList));
        });
        return lines;
    }
    visitExpression_list(ctx) {
        let exps = [];
        ctx.expression().forEach(exp => {
            exps.push(this.visitExpression(exp));
        });
        return exps;
    }
    visitDatabase_file_spec(ctx) {
        if (checked(ctx, ctx.file_group)) {
            return this.visitFile_group(ctx.file_group());
        }
        if (checked(ctx, ctx.file_spec)) {
            return this.visitFile_spec(ctx.file_spec());
        }
    }
    visitFile_group(ctx) {
        const id = this.visitId(ctx.id());
        const filestream = checked(ctx, ctx.FILESTREAM);
        const _default = checked(ctx, ctx.DEFAULT);
        const memoryOptimizedData = checked(ctx, ctx.MEMORY_OPTIMIZED_DATA);
        let fileSpecs = (checked(ctx, ctx.file_spec())
            && ctx.file_spec().map(_ => this.visitFile_spec(_)))
            || [];
        return {
            id,
            filestream,
            _default,
            memoryOptimizedData,
            fileSpecs
        };
    }
    visitFile_spec(ctx) {
        let name = "";
        let filename = "";
        if (checked(ctx, ctx.id())) {
            name = this.visitId(ctx.id());
        }
        if (checked(ctx, ctx.STRING)) {
            ctx.STRING().forEach(_ => {
                if (_.sourceInterval.a > ctx.FILENAME().sourceInterval.b) {
                    filename = _.text;
                }
                else {
                    name = _.text;
                }
            });
        }
        let tabSize = [];
        checked(ctx, ctx.SIZE) && (tabSize.push(ctx.SIZE()));
        checked(ctx, ctx.MAXSIZE) && (tabSize.push(ctx.MAXSIZE()));
        checked(ctx, ctx.FILEGROWTH) && (tabSize.push(ctx.FILEGROWTH()));
        if (tabSize.length > 0) {
            const result = mapBySourcePosition(tabSize, ctx.file_size());
        }
    }
    visitFull_table_name(ctx) {
        log("visitFull_table_name");
        const tableDef = {
            server: this.visitId(ctx._server),
            database: this.visitId(ctx._database),
            schema: this.visitId(ctx._schema),
            table: this.visitId(ctx._table)
        };
        //console.log(tableDef);
        return tableDef;
    }
    visitTable_name(ctx) {
        log("visitTable_name");
        const tableDef = {
            database: this.visitId(ctx._database),
            schema: this.visitId(ctx._schema),
            table: this.visitId(ctx._table)
        };
        //console.log(tableDef);
        return tableDef;
    }
    visitDdl_object(ctx) {
        if (checked(ctx, ctx.full_table_name)) {
            return this.visitFull_table_name(ctx.full_table_name());
        }
    }
    visitColumn_name_list(ctx) {
        let ids = [];
        ctx.id().forEach(id => {
            ids.push(this.visitId(id));
        });
        return ids;
    }
    visitData_type(ctx) {
        let type = {
            par: (ctx.DECIMAL() && ctx.DECIMAL().join("")) || (ctx.MAX() && ctx.MAX().text),
            id: ctx.id && this.visitId(ctx.id()),
            double: ctx.DOUBLE() && ctx.DOUBLE().text,
            precision: ctx.PRECISION() && ctx.PRECISION().text,
            int: ctx.INT() && ctx.INT().text,
            smallInt: ctx.SMALLINT() && ctx.SMALLINT().text,
            bigint: ctx.BIGINT() && ctx.BIGINT().text
        };
        log(`dataType`, type);
        return type;
    }
    visitId(ctx) {
        if (!ctx)
            return;
        if (checked(ctx, ctx.simple_id)) {
            log("simple_id", ctx.simple_id().text);
            return ctx.simple_id().text;
        }
        if (checked(ctx, ctx.DOUBLE_QUOTE_ID)) {
            log("DOUBLE_QUOTE_ID", ctx.DOUBLE_QUOTE_ID().text);
            return ctx.DOUBLE_QUOTE_ID().text;
        }
        if (checked(ctx, ctx.SQUARE_BRACKET_ID)) {
            log("SQUARE_BRACKET_ID", ctx.SQUARE_BRACKET_ID().text);
            return ctx.SQUARE_BRACKET_ID().text;
        }
        return ctx.text;
    }
    visitFile_size(ctx) {
        let unit = checked(ctx, ctx.KB) && ctx.KB().text;
        checked(ctx, ctx.MB) && (unit = ctx.MB().text);
        checked(ctx, ctx.GB) && (unit = ctx.GB().text);
        checked(ctx, ctx.TB) && (unit = ctx.TB().text);
        ctx.text.indexOf("%") > -1 && (unit = "%");
        return {
            decimal: ctx.DECIMAL().text,
            unit
        };
    }
    constructor(parser) {
        this.parser = parser;
    }
}
exports.Visitor = Visitor;
//# sourceMappingURL=Visitor.js.map