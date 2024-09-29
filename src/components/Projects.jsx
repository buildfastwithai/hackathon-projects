import { Container, Row, Col, Tab } from "react-bootstrap";
import BasicExample, { ProjectCard } from "./ProjectCard";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import TrackVisibility from 'react-on-screen';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

export const Projects = () => {

  const projects = [
    {
      title: "Assignment Aider 📝",
      description: "Unlock the power of AI with Assignment Aider! Just input your assignment questions, and let our advanced language model generate insightful, well-structured answers customized to your handwriting style. Say goodbye to assignment stress and hello to personalized, high-quality responses!",
      link: "https://assignment-aider-ppaqn5mpfyvemnntjvom7f.streamlit.app/"

    },
    {
      title: "ClipWise 🎥",
      description: "Elevate your video learning experience with ClipWise! Simply enter any YouTube video link, and receive concise summaries and engaging Q&A sections. Ideal for quick revisions or in-depth understanding, ClipWise helps you grasp key concepts efficiently.",
      link: ""

    },
    {
      title: "WebSage 🌐",
      description: "Dive into the web with WebSage! This powerful tool summarizes website content, distilling articles, blogs, and tutorials into digestible insights. With integrated Q&A features, WebSage makes it easy to clarify doubts and enhance your understanding of complex topics.",
      link: ""

    },
    {
      title: "DocuNinja 📄",
      description: "Master document review with DocuNinja! Upload any document type—PPTs, DOCs, PDFs, HTMLs, or CSVs—and let our AI generate concise summaries and provide Q&A for further clarification. Extract maximum value from your documents in no time!",
      link: ""

    },
    {
      title: "QuickCheat Creator 🥇",
      description: "Prepare for exams with confidence using QuickCheat Creator! Simply enter the topic name to generate customized cheat sheets filled with key concepts and essential information. Perfect for quick reviews and last-minute studying!",
      link: ""

    }, {
      title: " QuizMaster Pro 🎉",
      description: "Transform your study sessions with QuizMaster Pro! Input a topic or upload relevant materials, and our intelligent AI will create customized quizzes to reinforce your knowledge. Ideal for self-assessment and collaborative study, QuizMaster Pro makes learning dynamic and enjoyable.",
      link: ""

    }

  ];

  return (
    <section className="project" id="projects">



      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div >
                  <h2>EduAI Suite - One Platform, for All</h2>
                  <p></p>
                  <Tab.Container id="projects-tabs" defaultActiveKey="first">

                    <Tab.Content  >
                      <Tab.Pane eventKey="first">
                        <Row>
                          {
                            projects.map((project, index) => {
                              return (
                                // <BasicExample />
                                <ProjectCard key={index} title={project.title} description={project.description} link={project.link} />
                              )
                            })
                          }
                        </Row>
                      </Tab.Pane>
                      <Tab.Pane eventKey="section">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                      </Tab.Pane>
                      <Tab.Pane eventKey="third">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2}></img>
    </section>
  )
}
