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
        startPoint: {x: 195.5, y: 135},
        routes: [
            {x: 195.5, y: 116},
            {x: 211, y: 116},
            {x: 211, y: 95}
        ]
    },
    {
        num: '№115625',
        manufacture: 'АТ-8',
        tare: 11,
        test: 11,
        startPoint: {x: 282, y: 121},
        routes: [
            {x: 368, y: 121},
            {x: 368, y: 202},
            {x: 378, y: 202}
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
