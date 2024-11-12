# Progetto dama per l'esame di SAW

il progetto è suddiviso in 4 cartelle

assets, che contiene i file immagini ed audio
models, che contiene interfacce ed enum e qualche metodo ad esso correlato
components, che contiene tutte le functional components di react
logic, che contiene tutte le funzioni del gioco non grafiche

Descrizione delle funzionalità

il gioco permette di scegliere fra 3 modalità
Play Online
Play vs bot
Play with Friend

in play vs bot le azioni dell'avversario saranno eseguite istantaneamente dopo il proprio/propri turni
in play with friend dovremo muovere sia le bianche che le nere

play online richiede di loggarsi con google, una volta eseguito l'accesso sarà possibile giocare con un'avversario randomico (a fini anche di testing iniziando due volte una partita online si dovrebbe finire come avversari di se stessi ed avere la possibilità di muovere sia bianche che nere)

le partite in locale sono salvate su firestore al completamento
le partite online sono salvate ad ogni mossa effettuata

premendo il tasto home è possibile tornare alla schermata iniziale, vicino ai tasti per iniziare una partita c'è anche quello per guardare le proprie stats
