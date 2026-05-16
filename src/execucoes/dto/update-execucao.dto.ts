import { PartialType } from "@nestjs/mapped-types";
import { CreateExecucaoDto } from "./create-execucao.dto";

export class UpdateExecucaoDto extends PartialType(CreateExecucaoDto) { }