import { UnprocessableEntityException } from '@nestjs/common';
import { CreateVMComponentDTO } from '../dtos/CreateVMComponent.dto';

export class CreateVMComponentValidator {
  public static validate(dto: CreateVMComponentDTO): CreateVMComponentDTO {
    const { name, image, isChild } = dto;
    let { props, children } = dto;

    if (!name || name.length < 3) {
      throw new UnprocessableEntityException("Attribute 'name' is required.");
    }

    if (!image) {
      throw new UnprocessableEntityException("Attribute 'image' is required.");
    }

    if (!children) {
      throw new UnprocessableEntityException(
        "Attribute 'children' is required.",
      );
    }
    children = [...new Set(children)];

    if (!props) {
      throw new UnprocessableEntityException("Attribute 'props' is required.");
    }

    props = props
      .map((x) => {
        return {
          description:
            x.description && x.description.length > 0 ? x.description : null,
          name: x.name && x.name.length > 0 ? x.name : null,
          type: x.type && x.type.length > 0 ? x.type : null,
          value: x.value && x.value.length > 0 ? x.value : null,
        };
      })
      .filter((x) => !Object.values(x).some((y) => !y));

    return {
      name,
      image,
      children,
      isChild: !!isChild,
      props,
    };
  }
}
