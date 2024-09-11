import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from "typeorm";

@Entity("db_instances")
export class DBInstancesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dbName: string;

    @Column()
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
