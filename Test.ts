import { ANTLRInputStream, CommonTokenStream, ConsoleErrorListener } from 'antlr4ts';
import {ParseTreeWalker} from "antlr4ts/tree";
import * as Parser from "./src/grammar/TSqlParser";
import * as Lexer from "./src/grammar/TSqlLexer";
import {CaseInsensitiveInputStream} from "./src/CaseInsensitiveInputStream";
import { Listener, hash , prc, fct} from './Listener';
import { Visitor, TABLES, STMTS } from './Visitor';


// Create the lexer and parser
let inputStream = new CaseInsensitiveInputStream(new ANTLRInputStream(`
CREATE TABLE Persons (
  PersonID  INT          NULL     ,
  LastName  VARCHAR(255) NOT NULL ,
  FirstName VARCHAR(255) NOT NULL ,  
  Address   VARCHAR(255)          ,
  City      VARCHAR(255) 
);

INSERT INTO Persons 
       (PersonID, LastName, FirstName, Address , City )
VALUES (1       , 'DUCK'  , 'DONALD' , 'ADD 1' , 'City 1'),
       (2       , 'MOUSE' , 'MICKEY' , 'ADD 2' , 'City 2');


SELECT * FROM Persons
  ORDER BY LastName ASC;

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