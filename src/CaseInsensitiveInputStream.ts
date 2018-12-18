import { ANTLRInputStream, CharStream } from "antlr4ts";
import { Interval } from "antlr4ts/misc/Interval";
import { Table_value_constructorContext } from "./grammar/TSqlParser";

export class CaseInsensitiveInputStream implements CharStream {
	protected _stream: ANTLRInputStream;
	protected _case: boolean;
	
	constructor(inputStream: string, upperCase: boolean);
	constructor(inputStream: ANTLRInputStream, upperCase: boolean);
	constructor(...args: any[])	{
		const inputStream = args[0];
		const upperCase = args[1] === true ? true : false;

		this._stream = typeof(inputStream) === "string" 
			? 
			new ANTLRInputStream(inputStream) 
			: 
			inputStream;

		this._case = upperCase;
	}

	get name(): string {
		return this._stream.name;
	}

	set name(value: string) {
		this._stream.name = value;
	}

	reset(): void {
		this._stream.reset();
	}

	consume(): void {
		this._stream.consume();
	}

	LA(offset: number): number {
		let c = this._stream.LA(offset);
		if (c <= 0) {
			return c;
		}
		return String.fromCharCode(c)[this._case ? "toUpperCase" : "toLowerCase"]().codePointAt(0);
	}

	LT(offset: number): number {
		return this._stream.LT(offset);
	}

	get index(): number {
		return this._stream.index;
	}

	get size(): number {
		return this._stream.size;
	}
	
	mark(): number {
		return this._stream.mark();
	}

	release(marker: number): void {
		this._stream.release(marker);
	}

	getText(interval: Interval): string {
		return this._stream.getText(interval);
	};

	seek(index: number): void {
		this._stream.seek(index);
	}

	get sourceName(): string {
		return this._stream.sourceName;
	}

	toString(): string {
		return this._stream.toString();
	}
}