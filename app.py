import os
from flask import Flask, render_template

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

# Reflections
quotes = [
    "Most success comes from mastering the basics. Experiment with a small percentage, and integrate what works back into your foundation.",
    "You are only as good as what you can get your athletes (or others) to do. - Carl Valle",
    "Tech and data don't make the difference. It's the decisions and adjustments you are able to implement with your coaches and athletes.",
    "In the past, I avoided hiring people I thought could be better than me, out of self-protection. This only exposed my insecurities, limited my growth, and made my position less secure in the long run.",
    "Perhaps, the most important analytical skill is understanding what data CANNOT tell you. - Peter Weyand",
    "When working with athletes, health is a requirement, not a goal.",
    "At certain times, prioritize learning and growth over a higher paycheck if you can. This was one of the best things I did for my career.",
    "I've been an outsider to the sport I was working with multiple times, and what helped was staying critical, rely on knowledgeable insiders to adapt ideas, and leaving room to experiment.",
    "An important skill to develop to help advance your career is the ability to come up with and communicate well-founded opinions to address current challenges.",
    "An easy way to gain early buy-in and credibility after joining a new organization is to find ways to help others save time on their tasks.",
    "3 signs of good leadership: set a clear direction, empower others, and establish a continuous feedback loop.",
    "Providing direction is mainly about defining the boundaries within which the members of your team can find possible solutions.",
    "Regarding direction, finding the balance between setting clear boundaries and allowing enough space for creativity is key to let new ideas to emerge.",
    "Old but relevant: Direction before speed.",
    "Master the 3Cs: code, coach, and communicate.",
    "Specialization got me into pro sports; but career progression came from general knowledge.",
    "If you want to speed up learning, monitoring strategies should concentrate on less but more relevant aspects.",
    "Assessments should be relevant, actionable, and integrated into training. Those that can't be embedded better have a significant impact.",
    "The more complex the environment, the simpler the solution. Especially in environments with heavy schedules and high volume of athletes.",
    "Lifting heavy and often during the season is a priority. Even the busiest schedules have opportunities.",
    "Meaningful experience comes from trial and error, not just years on the job. When hiring, look for exposures to trial-and-error cycles.",
    "Get used to making decisions with limited information and high uncertainty. Sport Science requires a lot of intuition.",
    "The main limitation to predict injuries is our ability to collect meaningful data.",
    "Your current athletes don't care about the rings on your shelf.",
    "Skill acquisition often comes second to other routine sports science tasks. A key role for sports scientists is to develop systems that streamline decision-making, freeing up time to research and develop critical areas with high ROI.",
    "My first jobs came through interviews. Networking and connections came into play later after proving value in previous roles. Learning to interview is an essential skill.",
    "I applied to many jobs, even ones I wasn't interested in, just to get better at interviewing.",
    "When hiring, advertise job vacancies, even if you have candidates in mind. You never know what talent is out there.",
    "When someone asks about your philosophy, they want to know your values, beliefs and priorities as they will drive decisions and ensure consistency.",
    "The ability to clearly explain your philosophy matters more than being 'right or wrong.' Break the field into smaller areas, document your beliefs, and review them regularly for clarity and focus.",
    "The goal is to establish good operational processes; talent, coaching and luck handle the rest.",
    "Arbitrary number but four years in one organization seems like the minimum time for someone to go through meaningful implementation, iteration, and learning.",
    "A strong proof that your team is setting the standard is when your coaches become sought after by other organizations.",
    "The sports world is small. I once interviewed someone who had interviewed me six years earlier. Be kind; you never know when you'll cross paths again.",
    "Many problems we solved in sport have commercial value. Think about ways to productize your work beyond your job.",
    "Ask five people in your organization what 'Player X' has to improve. If there's little agreement, you've found a big opportunity.",
    "When people are overpaid relative to their value, every idea, opinion, and person becomes a threat to them.",
    "Improving how to approach difficult conversations is one of the most important things when progressing to more leadership roles.",
    "If an organization needs a Head of Innovation; it's probably not truly innovative.",
    "'Winning Culture' is an overhyped term. You can't build culture; it's a consequence of people aligning with a purpose and finding personal value in the process.",
    "Better data at meaningful times outweights continuous monitoring.",
    "Practice design is often overlooked by sport scientists, yet it's one of the most impactful areas for coaches and athletes — far beyond just managing GPS metrics.",
    "Break performance into smaller, measurable components whenever possible. Athletes are more likely to buy in when they see clear, tangible links to their performance.",
    "Courses and certifications come and go but training theory and principles are ethernal.",
    "As a sport scientist, one of the most lasting things I can leave behind for an organization is solid data as not many other things last longer than a few generations of employees.",
    "In many fields — especially sport science — it's better to approach things with healthy skepticism rather than blind optimism.",
    "Exposing yourself to environments that require you to learn and adapt will do more for your growth than any paid mentorship.",
    "Affordable, reliable, and practical — you can have any two, but almost never all three."
]

@app.route('/')
def index():
    return render_template('index.html', quotes=quotes)

@app.route('/about')
def about():
    return render_template('about.html')
