Задачи:

newItems$ - !isFinalized && !inCar
selectedItems$ - !isFinalized && inCar
finalizesItems$ - isFinalized && !inCar

new -> selected -> finalizes


Что делать с failTask - задачи удаляем, но они снова могут успеть прийти с getTasks (возможно стоит вести список удаленных и фильтровать их при получении)

CurrentTaskTrackingService
