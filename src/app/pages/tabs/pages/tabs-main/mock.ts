import {IDiagram} from './tabs-main.page';

export const MAIN_PAGE_DATA: IDiagram = {
    total: 14,
    sections: [
        {
            name: 'Новые',
            value: 5,
            color: 'var(--index-fact-color)'
        },
        {
            name: 'В работе',
            value: 2,
            color: 'var(--border-blue-color)'
        },
        {
            name: 'Выполнены',
            value: 7,
            color: 'var(--index-green1-color)'
        }
    ]
};
