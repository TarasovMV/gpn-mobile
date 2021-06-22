import {ITasksItem} from './tabs-tasks.page';

export const TASKS_IN_PROGRESS: ITasksItem[] = [
    {
        num: '№113444',
        manufacture: 'АТ-5',
        tare: 8,
        test: 5
    },
    {
        num: '№113445',
        manufacture: 'АТ-6',
        tare: 1,
        test: 1
    }
];

export const NEW_TASKS: ITasksItem[] = [
    {
        num: '№115623',
        manufacture: 'АТ-9',
        tare: 4,
        test: 6,
        startPoint: {x: 325, y: 168},
        routes: [
            {x: 369, y: 168},
            {x: 369, y: 272},
            {x: 367, y: 272},
            {x: 367, y: 267}
        ]
    },
    {
        num: '№115625',
        manufacture: 'АТ-8',
        tare: 11,
        test: 11,
        startPoint: {x: 367, y: 267},
        routes: [
            {x: 367, y: 275},
            {x: 369, y: 275},
            {x: 448, y: 275},
            {x: 448, y: 282},
        ]
    },
    {
        num: '№115626',
        manufacture: 'АТ-7',
        tare: 8,
        test: 8
    },
    {
        num: '№115627',
        manufacture: 'ГФУ-2',
        tare: 10,
        test: 10
    },
    {
        num: '№115623',
        manufacture: 'АТ-9',
        tare: 4,
        test: 6
    },
];
