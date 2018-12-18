import { ANTLRInputStream, CommonTokenStream, ConsoleErrorListener } from 'antlr4ts';
import {ParseTreeWalker} from "antlr4ts/tree";
import * as Parser from "./src/grammar/TSqlParser";
import * as Lexer from "./src/grammar/TSqlLexer";
import {CaseInsensitiveInputStream} from "./src/CaseInsensitiveInputStream";
import { Listener, hash , prc, fct} from './Listener';


// Create the lexer and parser
let inputStream = new CaseInsensitiveInputStream(new ANTLRInputStream(`
  DECLARE @date DATE = '20181225';
  DECLARE @result INT;

  SELECT * FROM [dbo].[T_SOURCE] S
    INNER JOIN [dbo].[T_JOIN] J
      ON [dbo].[T_SOURCE].[ID] = [dbo].[T_JOIN].[ParentId]
  ORDER BY [dbo].[T_SOURCE].[Id] ASC;

  EXEC [dbo].[SP_SUPER_PROC] @yesterday;

  EXEC @result = [dbo].[MyFunction] @date;


`), true);
let lexer       = new Lexer.TSqlLexer(inputStream)                    ;
let tokenStream = new CommonTokenStream(lexer)                        ;
let parser      = new Parser.TSqlParser(tokenStream)                  ;
parser.buildParseTree = true;

let lst = new Listener(parser);
// Parse the input, where `compilationUnit` is whatever entry point you defined

ParseTreeWalker.DEFAULT.walk(lst as any, parser.tsql_file());

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