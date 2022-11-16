import * as React from "react";
import UserProject from "../../scripts/UserProject";
import FileTitle from "./file/fileTitle";
import "./../../css/fileViewer.css";
import "./../../css/utils.css";

interface FileViewerProps {
  userProject: UserProject;
}

const FileViewer: React.FunctionComponent<FileViewerProps> = ({
  userProject,
}) => {
  let activeWorkingFileId = userProject.activeWorkingFileId;
  let openFileIdList = userProject.getOpenUserFileIdList;

  const [questionList, setQuestionList]: [
    [string, boolean][],
    React.Dispatch<React.SetStateAction<[string, boolean][]>>
  ] = React.useState([
    castTrueTupleToBooleanTuple(["Q1", true]),
    // ["Q2", true],
    // ["Q3", false],
    // ["Q1", true],
    // ["Q2", true],
    // ["Q3", false],
  ]);

  function castTrueTupleToBooleanTuple(
    tuple: [string, true]
  ): [string, boolean] {
    return tuple;
  }

  const [answerList, setAnswerList]: [
    [string, boolean][][],
    React.Dispatch<React.SetStateAction<[string, boolean][][]>>
  ] = React.useState([
    [
      ["A11", false],
      ["A12", true],
      ["A13", false],
    ],
    // [
    //   ["A21", false],
    //   ["A22", false],
    //   ["A23", false],
    // ],
    // [
    //   ["A31", true],
    //   ["A32", true],
    //   ["A34", false],
    // ],
    // [
    //   ["A11", false],
    //   ["A12", true],
    //   ["A13", false],
    // ],
    // [
    //   ["A21", false],
    //   ["A22", false],
    //   ["A23", false],
    // ],
    // [
    //   ["A31", true],
    //   ["A32", true],
    //   ["A34", false],
    // ],
  ]);

  function renderAnswerButtonColor(isCorrect: boolean) {
    if (isCorrect) {
      return "#4cbb17cc";
    } else {
      return "#ff2400ee";
    }
  }

  function renderQuestionButtonColor(isInQuiz: boolean) {
    if (isInQuiz) {
      return {
        backgroundColor: "rgba(255,255,255,0.05)",
        color: "#ddd",
      };
    } else {
      return {
        backgroundColor: "#ff0",
        color: "#ff0",
      };
    }
  }

  return (
    <div className="fileViewer noselect">
      <div className="fileNameContainer">
        <div className="fileNameBar">
          <FileTitle title="file 1" />
          <FileTitle title="file 2" />
        </div>
      </div>
      <div className="bodyFile">
        <form action="" className="fileContent">
          <div className="title">{"File 1"}</div>
          {questionList.map((q, i) => (
            <div className="questionGrid" key={i}>
              <div className="question">
                {
                  <div className="specificQuestion">
                    <p
                      className="noselect"
                      style={{
                        backgroundColor: renderQuestionButtonColor(q[1])
                          .backgroundColor,
                        color: renderQuestionButtonColor(q[1]).color,
                      }}
                      onClick={() => {
                        let stateCopy = [...questionList];
                        stateCopy[i][1] = !stateCopy[i][1];
                        setQuestionList(stateCopy);
                      }}
                    >
                      {"Q" + (i + 1)}
                    </p>
                    <input
                      value={q[0]}
                      onChange={(e) => {
                        let stateCopy = [...questionList];
                        stateCopy[i][0] = e.target.value;
                        setQuestionList(stateCopy);
                      }}
                      onFocus={(e) => {
                        e.target.select();
                      }}
                    ></input>
                  </div>
                }
              </div>
              {answerList[i].map((a, j) => (
                <div className="answer" key={j}>
                  {
                    <div className="specificAnswer">
                      <p
                        className="noselect"
                        style={{
                          backgroundColor: renderAnswerButtonColor(a[1]),
                        }}
                        onClick={() => {
                          let stateCopy = [...answerList];
                          stateCopy[i][j][1] = !stateCopy[i][j][1];
                          setAnswerList(stateCopy);
                        }}
                      >
                        {String.fromCharCode(97 + j)}
                      </p>
                      <input
                        value={a[0]}
                        onChange={(e) => {
                          let stateCopy = [...answerList];
                          stateCopy[i][j][0] = e.target.value;
                          setAnswerList(stateCopy);
                        }}
                        onFocus={(e) => {
                          e.target.select();
                        }}
                      ></input>
                    </div>
                  }
                </div>
              ))}
              <div className="answer">
                <div className="specificAnswer addAnswer">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      let stateCopy = [...answerList];
                      stateCopy[i].push(["New Answer", false]);
                      setAnswerList(stateCopy);
                    }}
                  >
                    Add another answer
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="question">
            <div className="specificQuestion addQuestion">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  let stateCopyAnswer = [...answerList];
                  stateCopyAnswer.push([["New Answer", true]]);
                  setAnswerList(stateCopyAnswer);
                  let stateCopyQuestion = [...questionList];
                  stateCopyQuestion.push(["New Question", true]);
                  setQuestionList(stateCopyQuestion);
                }}
              >
                Add another question
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileViewer;
