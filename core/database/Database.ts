export class DatabaseFileSpec {
  fileGroups : Array<FileGroup> ;
  fileSpecs  : Array<FileSpec>  ;
}

export class FileGroup {
  id                           : string          ;
  containsFilestream?          : boolean         ;
  default?                     : boolean         ;
  containsMemoryOptimizedData? : boolean         ;
  fileSpecs                    : Array<FileSpec> ;
}

export type Units = "KB" | "MB" | "TB" | "GB" | "%";

export type FileSize = {
  decimal : number, 
  unit    : Units
}

export class FileSpec {
  name        : string                 ;
  filename?   : string                 ;
  size?       : FileSize               ;
  maxSize?    : FileSize | 'UNLIMITED' ;
  fileGrowth? : FileSize               ;
}

export class Database {
  id                  : string                        ;
  containment?        : "NONE" | "PARTIAL"            ;
  NonTransactedAccess : "OFF"  | "READ_ONLY" | "FULL" ;
  onPrimary           : boolean                       ;
  on                  : Array<DatabaseFileSpec>       ;
  logOn               : Array<DatabaseFileSpec>       ;
  collate             : string                        ;
  with                : CreateDatabaseOption          ;
}

export class CreateDatabaseOption {
  filestream              : Array<databaseFilestreamOption> ;
  defaultLanguage         : string                          ;
  defaultFulltextLanguage : string                          ;
  nestedTriggers          : "OFF" | "ON"                    ;
  transformNoiseWords     : "OFF" | "ON"                    ;
  twoDigitYearCutoff      : number                          ;
  dbChaining              : "OFF" | "ON"                    ;
  trustworthy             : "OFF" | "ON"                    ;
}

export class databaseFilestreamOption {
  nonTransactedAccess : "OFF" | "READ_ONLY" | "FULL" ;
  directoryName       : string                       ;
}