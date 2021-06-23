import {ITasksItem} from './tabs-tasks.page';

export const TASKS_IN_PROGRESS: ITasksItem[] = [];
//     {
//         num: '№113444',
//         manufacture: 'АТ-5',
//         tare: 8,
//         test: 5
//     },
//     {
//         num: '№113445',
//         manufacture: 'АТ-6',
//         tare: 1,
//         test: 1
//     }
// ];

export const NEW_TASKS: ITasksItem[] = [
    {
        num: '№115623',
        manufacture: 'АТ-9',
        tare: 4,
        test: 6,
        startPoint: {x: 325 / 720 * 1000, y: 168 / 405 * 1000},
        routes: [
            {x: 369 / 720 * 1000, y: 168 / 405 * 1000},
            {x: 369 / 720 * 1000, y: 272 / 405 * 1000},
            {x: 367 / 720 * 1000, y: 272 / 405 * 1000},
            {x: 367 / 720 * 1000, y: 267 / 405 * 1000}
        ]
    },
    {
        num: '№115627',
        manufacture: 'ГФУ-2',
        tare: 10,
        test: 10,
        startPoint: {x: 368 / 720 * 1000, y: 266 / 405 * 1000},
        routes: [
            {x: 368 / 720 * 1000, y: 274 / 405 * 1000},
            {x: 320 / 720 * 1000, y: 274 / 405 * 1000}
        ]
    },
    {
        num: 'В ЕЛК',
        manufacture: 'В ЕЛК',
        tare: 11,
        test: 11,
        startPoint: {x: 320 / 720 * 1000, y: 274 / 405 * 1000},
        routes: [
            {x: 449 / 720 * 1000, y: 274 / 405 * 1000},
            {x: 449 / 720 * 1000, y: 282 / 405 * 1000},
        ],
        specialProps: ['elk']
    },
];
