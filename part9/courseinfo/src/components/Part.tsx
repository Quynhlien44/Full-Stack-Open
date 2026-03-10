import React from 'react';

import type { CoursePart } from '../App';

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled course part: ${JSON.stringify(value)}`);
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case 'basic':
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          <em>{part.description}</em>
        </p>
      );
    case 'group':
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case 'background':
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          <em>{part.description}</em>
          <br />
          submit to {part.backgroundMaterial}
        </p>
      );
    case 'special':
      return (
        <p>
          <strong>
            {part.name} {part.exerciseCount}
          </strong>
          <br />
          <em>{part.description}</em>
          <br />
          required skils: {part.requirements.join(', ')}
        </p>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
