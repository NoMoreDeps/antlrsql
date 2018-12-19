"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let hash = {};
exports.hash = hash;
let fct = {};
exports.fct = fct;
let prc = {};
exports.prc = prc;
class Visitor {
    visit(tree) {
        const t = tree;
        console.log(t["prototype"]);
    }
    visitChildren(node) {
    }
    visitErrorNode(node) {
    }
    visitTerminal(node) {
    }
    visitTsql_file(ctx) {
        console.log("starting point");
        console.log(this.parser.ruleNames[ctx.ruleIndex]);
        ctx.batch().forEach(b => this.visitBatch(b));
    }
    visitBatch(ctx) {
        console.log("batch");
        console.log(this.parser.ruleNames[ctx.ruleIndex]);
        ctx.children.forEach(c => {
            console.log(this.parser.ruleNames[c["ruleIndex"]]);
        });
    }
    constructor(parser) {
        this.parser = parser;
    }
}
exports.Visitor = Visitor;
