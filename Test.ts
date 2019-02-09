import { ANTLRInputStream, CommonTokenStream, ConsoleErrorListener } from 'antlr4ts';
import {ParseTreeWalker} from "antlr4ts/tree";
import * as Parser from "./src/grammar/TSqlParser";
import * as Lexer from "./src/grammar/TSqlLexer";
import {CaseInsensitiveInputStream} from "./src/CaseInsensitiveInputStream";
import { Listener, hash , prc, fct} from './Listener';
import { Visitor, TABLES, STMTS } from './Visitor';


// Create the lexer and parser
let inputStream = new CaseInsensitiveInputStream(new ANTLRInputStream(`
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
let lexer       = new Lexer.TSqlLexer(inputStream)                    ;
let tokenStream = new CommonTokenStream(lexer)                        ;
let parser      = new Parser.TSqlParser(tokenStream)                  ;
parser.buildParseTree = true;

//let lst = new Listener(parser);
// Parse the input, where `compilationUnit` is whatever entry point you defined

//ParseTreeWalker.DEFAULT.walk(lst as any, parser.tsql_file());
let visitor = new Visitor(parser);
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