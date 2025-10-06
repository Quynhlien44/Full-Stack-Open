import React from 'react'

const Part = ({ name, exercises }) => (
    <p>
        {name} {exercises}
    </p>
)

const Content = ({ parts }) => (
    <div>
        {parts.map((part) => (
            <Part key={part.id} name={part.name} exercises={part.exercises} />
        ))}
    </div>
)

const Total = ({ parts }) => (
    <p>
        <strong>
            total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
        </strong>
    </p>
)

const Course = ({ course }) => (
    <div>
        <h2>{course.name}</h2>
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

export default Course;
