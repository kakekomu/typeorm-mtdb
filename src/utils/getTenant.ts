import { Entity } from "typeorm";
export function getTenantEntity() {
    return "TenantEntity" as any as typeof Entity;
}
