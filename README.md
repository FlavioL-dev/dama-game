# Progetto dama per l'esame di SAW

il progetto è suddiviso in 4 cartelle

assets, che contiene i file immagini ed audio<br>
models, che contiene interfacce ed enum e qualche metodo ad esso correlato<br>
components, che contiene tutte le functional components di react<br>
logic, che contiene tutte le funzioni del gioco non grafiche<br>
<br>
## Descrizione delle funzionalità:<br>
<br>
il gioco permette di scegliere fra 3 modalità: <br>
- Play Online<br>
- Play vs bot<br>
- Play with Friend<br>
<br>
in play vs bot le azioni dell'avversario saranno eseguite istantaneamente dopo il proprio/propri turni<br>
in play with friend dovremo muovere sia le bianche che le nere<br>
<br>
play online richiede di loggarsi con google, una volta eseguito l'accesso sarà possibile giocare con un'avversario randomico (a fini anche di testing iniziando due volte una partita online si dovrebbe finire come avversari di se stessi ed avere la possibilità di muovere sia bianche che nere)<br>
<br>
le partite in locale sono salvate su firestore al completamento<br>
le partite online sono salvate ad ogni mossa effettuata<br>
<br>
premendo il tasto home è possibile tornare alla schermata iniziale, vicino ai tasti per iniziare una partita c'è anche quello per guardare le proprie stats (per visualizzare le proprie stats bisogna essere loggati)<br>
