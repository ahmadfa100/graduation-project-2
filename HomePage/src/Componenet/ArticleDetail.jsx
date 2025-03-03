import { useParams } from 'react-router-dom';
import '../style/AgriculturalProject.css';
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const articles = [
  {
    id: 1,
    image: "https://i.pinimg.com/736x/01/e5/42/01e542756f2f8a3ef5778ffe945fcdc1.jpg",
    alt: "Smiling boy holding a stack of books",
    title: "Article 1 Title",
    paragraphs: [
      "This is the first article's text. The image at the top overlaps the gray section, creating a dynamic layout.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse in lacus id erat vestibulum aliquet."
    ]
  },
  {
    id: 2,
    image: "https://i.pinimg.com/736x/30/a6/47/30a647babaa06dde6d064458301df75a.jpg",
    alt: "Placeholder image for article 2",
    title: "Article 2 Title",
    paragraphs: [
      "This is the second article, which has its own distinct content and layout style.",
      "More unique content for article 2 goes here, describing its topic in detail."
    ]
  },
  {
    id: 3,
    image: "https://i.pinimg.com/736x/3e/3f/6b/3e3f6b67c4d46ebe9d0e10f44dea1f71.jpg",
    alt: "Placeholder image for article 3",
    title: "Article 3 Title",
    paragraphs: [
      "This is the third article with content different from the first two.",
      "Additional content for the third article is placed here, further elaborating on its subject."
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
    <div className="article-detail">
      <section className="content-section">
        <img src={article.image} alt={article.alt} />
        <h2>{article.title}</h2>
        {article.paragraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </section>
    </div>
  );
};

export default ArticleDetail;
