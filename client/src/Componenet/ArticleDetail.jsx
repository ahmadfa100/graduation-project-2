import { useParams } from 'react-router-dom';
import '../style/ArticleDetail.css';

const articles = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/1000057/pexels-photo-1000057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    alt: "Soil improvement visual",
    title: "Soil Improvement",
    paragraphs: [
      "Healthy soil is the foundation of productive, resilient farms. By building soil fertility and structure through eco-friendly practices, you’ll boost yields today and safeguard your land for generations.",
      "Key Benefits:",
      "Enhanced nutrient availability: Organic matter slowly releases essential nutrients.",
      "Improved water retention: Well-structured soils hold moisture longer, reducing irrigation needs.",
      "Greater biodiversity: A living soil ecosystem fosters beneficial microbes and earthworms.",
      "Practical Techniques:",
      "Composting: Gather kitchen scraps, crop residues, and animal manures. Layer 'greens' (nitrogen-rich) with 'browns' (carbon-rich), turn every 2–3 weeks; mature compost takes 3–6 months. Tip: Use finished compost as a top dressing or mix into planting beds at 5–10% by volume.",
      "Cover Crops: Plant fast-growing legumes (e.g., vetch, clover) or grasses (e.g., oats, rye) between main crops. They fix nitrogen, suppress weeds, and protect against erosion. Terminate by mowing or shallow tillage before seed set; leave residues on the surface.",
      "Green Manures & Crop Rotations: Rotate deep-rooted and shallow-rooted species to break disease cycles and improve structure. Incorporate green manures (e.g., mustard, buckwheat) into the soil when biomass peaks.",
      "Reduced Tillage: Minimize soil disturbance with no-till or strip-till systems. Use cover crops and residues to protect the surface and maintain a crumb structure."
    ]
  },
  {
    id: 2,
    image: "https://i.pinimg.com/736x/30/a6/47/30a647babaa06dde6d064458301df75a.jpg",
    alt: "Drip irrigation system in field",
    title: "Efficient Irrigation Methods",
    paragraphs: [
      "In Jordan’s arid environment, smart water use is critical. Well-designed drip and sprinkler systems deliver moisture precisely and cut losses to evaporation and runoff, helping you grow more with less.",
      "Advantages:",
      "Water savings: Deliver water only where plant roots need it.",
      "Higher yields: Consistent moisture encourages steady growth.",
      "Labor reduction: Automated systems free you from manual watering.",
      "System Options & Best Practices:",
      "Drip Irrigation: Components include mainline, sub-mains, laterals (drip tape or tubing), pressure regulators, and filters. Space emitters 15–30 cm apart; schedule short, frequent cycles (e.g., 15 min twice daily). Flush lines monthly and clean filters to prevent clogging.",
      "Sprinkler Irrigation: Use low-pressure rotating heads, micro-sprinklers, or pop-up impact sprinklers. Overlap spray patterns by 50% for uniform coverage. Water during early morning or late evening to reduce evaporation.",
      "Automation & Monitoring: Install moisture sensors at root depth (10–20 cm) to trigger irrigation only when needed. Use timers or smart controllers that adjust schedules based on temperature and evapotranspiration.",
      "Water Source Management: Harvest rainwater from rooftops into storage tanks. Treat and reuse lightly-used effluent where permitted, following local guidelines."
    ]
  },
  {
    id: 3,
    image: "https://i.pinimg.com/736x/3e/3f/6b/3e3f6b67c4d46ebe9d0e10f44dea1f71.jpg",
    alt: "Natural pest management in crops",
    title: "Sustainable Pest Management",
    paragraphs: [
      "Protecting crops without harsh chemicals preserves beneficial insects, safeguards water quality, and builds long-term resilience. A holistic approach integrates cultural, biological, and minimally disruptive organic treatments.",
      "Why Go Organic?:",  
      "Environmental safety: No synthetic residues in soil or water.",
      "Beneficial allies: Natural predators stay unharmed and help control future outbreaks.",
      "Market advantage: Growing consumer demand for pesticide-free produce.",
      "Integrated Strategies:",
      "Cultural Controls: Rotate crops to break pest life cycles. Remove crop residues and weeds that harbor pests. Intercrop with repellent species like marigolds and basil.",
      "Biological Controls: Introduce or conserve predators/parasitoids such as lady beetles for aphids, Trichogramma wasps for caterpillar eggs, and predatory nematodes for soil-dwelling larvae. Provide insectary strips with flowering plants.",
      "Organic Treatments: Use botanical insecticides (neem oil, pyrethrum), microbial agents (Bacillus thuringiensis, Beauveria bassiana), and physical barriers (row covers, sticky traps, pheromone traps) for targeted control.",
      "Monitoring & Thresholds: Scout fields weekly, noting pest counts versus economic thresholds (e.g., 5–10 aphids per leaf). Apply treatments only when thresholds are exceeded to preserve beneficial insects."
    ]
  }
];

const ArticleDetail = () => {
  const { id } = useParams();
  const article = articles.find(article => article.id === Number(id));

  if (!article) {
    return <div>Article not found.</div>;
  }

  return (
    <>
      <div className="article-detail">
        <section className="content-section">
          <img src={article.image} alt={article.alt} />
          <h2>{article.title}</h2>
          {article.paragraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </section>
      </div>
    </>
  );
};

export default ArticleDetail;
