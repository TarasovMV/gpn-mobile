import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'progressTime'
})
export class ProgressTimePipe implements PipeTransform {

    transform(value: number): string {
        if (!value) {
            return '';
        }

        const numSuffix = (num: number, forms: [string, string, string, string]) => {
            return forms[3];
            const formsTemplate = [
                [1],
                [2, 3, 4],
                [5, 6, 7, 8, 9, 0],
            ];
            const idx = formsTemplate.indexOf(formsTemplate.find((x) => x.includes(num)));
            console.log(idx);
            return forms[idx];
        };

        const dateTime = [
            {
                value: Math.floor(value / 1000 / 60 / 60),
                suffix: ['час', 'часа', 'часов', 'ч.'] as const,
            },
            {
                value: Math.floor((value / 1000 / 60) % 60),
                suffix: ['минута', 'минуты', 'минут', 'м.'] as const,
            },
            {
                value: Math.floor((value / 1000) % 60),
                suffix: ['секунда', 'секунды', 'секунд', 'c.'] as const,
            }
        ];

        const result = [];
        for (const val of dateTime) {
            result.push(
                !!val.value ? `${val.value} ${numSuffix(val.value, val.suffix as [string, string, string, string])}` : undefined
            );
        }

        return result.filter(x => !!x).join(' ');
    }
}
