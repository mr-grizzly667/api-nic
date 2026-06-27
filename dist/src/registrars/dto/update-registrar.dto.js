"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRegistrarDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_registrar_dto_1 = require("./create-registrar.dto");
class UpdateRegistrarDto extends (0, mapped_types_1.PartialType)(create_registrar_dto_1.CreateRegistrarDto) {
}
exports.UpdateRegistrarDto = UpdateRegistrarDto;
//# sourceMappingURL=update-registrar.dto.js.map