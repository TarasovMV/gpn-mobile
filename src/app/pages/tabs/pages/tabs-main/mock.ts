import {IDiagram} from './tabs-main.page';

export const MAIN_PAGE_DATA: IDiagram = {
    total: 2,
    sections: [
        {
            name: 'Новые',
            value: 2,
            color: 'var(--index-fact-color)'
        },
        {
            name: 'В работе',
            value: 0,
            color: 'var(--border-blue-color)'
        },
        {
            name: 'Выполнены',
            value: 0,
            color: 'var(--index-green1-color)'
        }
    ]
};
