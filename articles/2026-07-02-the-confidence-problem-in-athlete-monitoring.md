# The confidence problem in athlete monitoring

<!-- excerpt: More information can increase confidence without improving decisions. What does that mean for athlete monitoring? -->

**Author**: The Hidden Game ([@the_hidden_game](https://x.com/the_hidden_game))  
**Date**: 2026-07-02  
**Source**: <https://x.com/the_hidden_game/status/2072652939286704524>

---

![Cover](https://pbs.twimg.com/media/HMDDY_RWoAAOrcs.jpg)

There's a clip of Luis Enrique going around at the moment. In it he explains that part of his job is to give players the minimum information possible. He says coaches say too much at times, and that if he hands a player five ideas the player can't use, then he's given him nothing.

<blockquote class="twitter-tweet" data-conversation="none">
  <p><a href="https://x.com/kikollan/status/2072253032922861871?s=20">Watch the Luis Enrique clip on X</a></p>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

> *[Here is another version with English subtitles](https://youtube.com/shorts/z0Dgc1sfaWk?is=jN-uQA02DLW6eKbd)*

People are sharing it as a coaching insight, but it is also a data problem. Something I've seen often in high-performance departments.

---

Open whatever athlete monitoring platform you're using and look at one of your dashboards. Now ask yourself this question: *if this number came back high instead of low, would I actually do anything differently?*

I've gone through this myself and in many cases the answer is "*no*". That's what we often get wrong about data. We assume more information makes us "*more right*" when most times all it does is to make us "*more certain*". 

There is a study from the 1970s where researchers gave professional horse-race handicappers progressively more data on each horse. They started with five variables, then ten, then twenty, then forty. What they found was that accuracy plateaued after the first five. The only thing that kept climbing with more information was confidence. With forty metrics they were more confident in their judgement, but not more accurate ([Slovic, 1973](https://scholarsbank.uoregon.edu/items/1a910394-ad9e-4af2-8967-d743f046ae6a)).

Of course, that's an old study with methods that would probably be questioned today. But Tsai and colleagues did something similar in 2008, asking people to predict football games (among other things) and reached the same conclusion. More information increased confidence, but not accuracy ([Tsai et al., 2008](https://www.sciencedirect.com/science/article/abs/pii/S0749597808000460)).

I'll share a personal anecdote. 

A few years ago I started including the acute:chronic workload ratio in my reports. It seemed like an obvious win. It was easy to report and quickly showed whether a player was in the "safe" or "danger" zone. I liked it because it was clean. It took weeks of training load data and squeezed them into a single number a coach could understand in two seconds.

Then social media started filling up with critiques. Lolli and colleagues showed in 2019 that the maths behind the ratio is flawed. The acute load sits inside the chronic load, so the two aren't independent. As a result, the calculation produces a correlation whether or not anything real is there ([Lolli et al., 2019](https://bjsm.bmj.com/content/53/15/921)). Then, a year later, a paper from Impellizzeri's group went further, arguing that there was no evidence the ratio should be used to make load decisions at all, and that the way it is constructed makes it unreliable to begin with ([Impellizzeri et al., 2020](https://journals.humankinetics.com/view/journals/ijspp/15/6/article-p907.xml)).

Despite all this, I kept using it for longer than I should have. The only reason was that it made me feel more confident in my decisions. And giving that up turned out to be harder than admitting the metric was wrong.

This is actually quite common. More metrics tend to pay off straight away, not by improving decisions or increasing accuracy, but by increasing confidence. If a player pulls a hamstring and someone asks what the data is saying, you feel more protected. If a coach asks whether a player is ready or not, it feels easier to justify your recommendation objectively. And because it's difficult to evaluate the quality of those decisions over time, it's much easier to optimise for feeling safe (or confident) in the moment.

I'm not saying data is useless. Don't get me wrong. But we have to optimise the signal in the data for what really matters. What data we collect depends on the sport and your context. There isn't a universal recipe. 

The goal isn't to have fewer metrics or metrics that are easy to collect. The goal is to have the right metrics. Just as the horse handicappers still beat random chance with only five variables. We need to identify our "five" metrics.

And there's one more thing I'd like to touch on. Gerd Gigerenzer (a German psychologist who has done extensive research on the use of heuristics in decision making) has spent decades showing that a few well-chosen cues often outperform more complicated models. He calls this the "*less-is-more* effect". As you pile on variables you start fitting noise, so a simple rule that ignores most of the available information often generalises better to the next case ([Gigerenzer & Goldstein, 1996](https://psycnet.apa.org/record/1996-06397-002)).

Take one example from medicine. Emergency doctors trying to identify a heart attack did better with a simple tree of three *yes/no* questions than with a complex risk score and even better than their own judgement ([Green & Mehr, 1997](https://www.thefreelibrary.com/What+alters+physicians%27+decisions+to+admit+to+the+coronary+care+unit%3F-a019891677)). Just three questions beat an assessment that used for more information.

Playing devil's advocate, at this point you might be thinking: *if less is more, why do some of the most data-led organisations in the world keep collecting more?*

I've worked at organisations with large research and data departments. The line I heard most from the engineers was "*just give me all the data and I'll figure it out.*" And that's the right approach for them. Unlike humans, a model doesn't get more confident and less accurate. Feed it more data and it often does better.

It's the same in Formula 1. A car carries hundreds of sensors and generates over a million data points every second. But the race engineer isn't staring at all of them and the driver sees almost none of them. Most of that information feeds models, simulations or post-race analysis. By the time it reaches the person making the next decision, the data has already been distilled into the few pieces of information that actually matter.

The model and the practitioner have different jobs. One extracts signal from complexity. The other has to make a decision using a handful of cues. This is the exact same situation the horse-race handicappers were in, where more was not better either.

That's the difference. Feed the model everything, but the moment a number has to pass through a person before it becomes a decision, less is more again.

So if you go back to your athlete monitoring dashboard, those extra charts and those added columns are all competing for attention and maybe even adding noise.

The question is whether the information on the screen can actually change what you do or just make you feel better about the decision that you have already made.

Maybe we've been treating athlete monitoring as a measurement problem, when it's really an organisational design problem. More on that another time.

---

## References

Gigerenzer, G., & Goldstein, D. G. (1996). "Reasoning the Fast and Frugal Way: Models of Bounded Rationality." Psychological Review, 103(4), 650–669.

Green, L., & Mehr, D. R. (1997). "What alters physicians' decisions to admit to the coronary care unit?" The Journal of Family Practice, 45(3), 219–226.

Impellizzeri, F. M., Tenan, M. S., Kempton, T., Novak, A., & Coutts, A. J. (2020). "Acute:Chronic Workload Ratio: Conceptual Issues and Fundamental Pitfalls." International Journal of Sports Physiology and Performance, 15(6), 907–913.

Lolli, L., Batterham, A. M., Hawkins, R., Kelly, D. M., Strudwick, A. J., Thorpe, R., Gregson, W., & Atkinson, G. (2019). "Mathematical coupling causes spurious correlation within the conventional acute-to-chronic workload ratio calculations." British Journal of Sports Medicine, 53(15), 921–922.

Slovic, P. (1973). "Behavioral Problems of Adhering to a Decision Policy." Paper presented at the Institute for Quantitative Research in Finance.

Tsai, C. I., Klayman, J., & Hastie, R. (2008). "Effects of amount of information on judgment accuracy and confidence." Organizational Behavior and Human Decision Processes, 107(2), 97–105.
