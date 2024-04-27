import { Module } from "@nestjs/common";
import { SubFeedbackService } from "./subFeedback.service";
import { SubFeedbackController } from "./subFeedback.controller";




@Module({
    imports: [],
    controllers: [SubFeedbackController],
    providers: [SubFeedbackService],
  })
  export class SubFeedbackModule {}

