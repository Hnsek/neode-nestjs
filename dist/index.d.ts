import { DynamicModule } from '@nestjs/common';
import Neode from 'neode';
export interface IConnection {
    host: string;
    username: string;
    password: string;
    port: number;
}
interface Schema {
    [label: string]: Neode.SchemaObject;
}
export declare class NeodeModule {
    static forRoot(connection?: IConnection): DynamicModule;
    static forFeature(schema: Schema, connection?: IConnection): DynamicModule;
}
export {};
