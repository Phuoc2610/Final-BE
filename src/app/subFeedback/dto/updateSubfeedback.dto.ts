import { PartialType } from "@nestjs/swagger";
import { CreateSubFeedbackDTO } from "./createSubFeedback.dto";

export class UpdateSubFeedbackDTO extends PartialType(CreateSubFeedbackDTO){

}