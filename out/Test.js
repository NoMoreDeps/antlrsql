"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const antlr4ts_1 = require("antlr4ts");
const Parser = __importStar(require("./src/grammar/TSqlParser"));
const Lexer = __importStar(require("./src/grammar/TSqlLexer"));
const CaseInsensitiveInputStream_1 = require("./src/CaseInsensitiveInputStream");
const Visitor_1 = require("./Visitor");
// Create the lexer and parser
let inputStream = new CaseInsensitiveInputStream_1.CaseInsensitiveInputStream(new antlr4ts_1.ANTLRInputStream(`
CREATE DATABASE TWO_DIGIT_YEAR_CUTOFF
ON  
PRIMARY    
    (NAME = Arch1,  
    FILENAME = 'D:\SalesData\archdat1.mdf',  
    SIZE = 100MB,  
    MAXSIZE = 200,  
    FILEGROWTH = 20),  
    ( NAME = Arch2,  
    FILENAME = 'D:\SalesData\archdat2.ndf',  
    SIZE = 100MB,  
    MAXSIZE = 200,  
    FILEGROWTH = 20),  
    ( NAME = Arch3,  
    FILENAME = 'D:\SalesData\archdat3.ndf',  
    SIZE = 100MB,  
    MAXSIZE = 200,  
    FILEGROWTH = 20)  
LOG ON   
   (NAME = Archlog1,  
    FILENAME = 'D:\SalesData\archlog1.ldf',  
    SIZE = 100MB,  
    MAXSIZE = 200,  
    FILEGROWTH = 20),  
   (NAME = Archlog2,  
    FILENAME = 'D:\SalesData\archlog2.ldf',  
    SIZE = 100MB,  
    MAXSIZE = 200,  
    FILEGROWTH = 20)
COLLATE French_CI_AI  
WITH TRUSTWORTHY ON, DB_CHAINING ON;  
`), true);
let lexer = new Lexer.TSqlLexer(inputStream);
let tokenStream = new antlr4ts_1.CommonTokenStream(lexer);
let parser = new Parser.TSqlParser(tokenStream);
parser.buildParseTree = true;
//let lst = new Listener(parser);
// Parse the input, where `compilationUnit` is whatever entry point you defined
//ParseTreeWalker.DEFAULT.walk(lst as any, parser.tsql_file());
let visitor = new Visitor_1.Visitor(parser);
parser.tsql_file().accept(visitor);
/*
for(let k in hash) {
  let str = `
-- Found table ${hash[k].schema}.${hash[k].table} ${hash[k].alias ? " with alias " + hash[k].alias : ""}
EXEC tSQLt.FakeTable '${hash[k].schema}.${hash[k].table}';`;
  console.log(str);
}

for(let k in prc) {
  let str = `
-- Found Procedure ${k}
EXEC tSQLt.SpyProcedure '${k}';`
  console.log(str);
}

for(let k in fct) {
  let str = `
-- Found function ${k}
EXEC tSQLt.FakeFunction '${k}';`
  console.log(str);
}

//EXEC tSQLt.FakeFunction 'SalesApp.ComputeCommission', 'SalesAppTests.Fake_ComputeCommission';
//console.log(result);
*/ 
//# sourceMappingURL=Test.js.map