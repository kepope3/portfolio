import React, { useEffect, useState } from "react";
import styles from "./../../../Assets/CSS/Body/typingGame.module.css";
import Wpm from "./Wpm";

export default () => {
  const [sentence, setSentence] = useState("");
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [noChars, setNoChars] = useState(0);
  const [wpm, setwpm] = useState();
  const [mistakes, setMistakes] = useState(0);
  const [textFieldDisabled, setTextFieldDisabled] = useState(false);

  useEffect(() => {
    getParagraph(setSentence);
  }, []);

  useEffect(() => {
    if (sentence.length === 1 && hasGameStarted) {
      setHasGameStarted(false);
      setTextFieldDisabled(true);
    }
  }, [sentence, hasGameStarted]);

  return (
    <>
      <h2>Typing game</h2>
      <h3>
        Start the game by copying the sentence into the text field. Hit 'New
        sentence' to try and beat your score.
      </h3>
      <div className="jumbotron" style={{ backgroundColor: "#212529" }}>
        <p className={styles.firstChar}>{sentence && sentence[0]}</p>
        <p className={styles.sentence}>{sentence}</p>
        {hasGameStarted && <Wpm noChars={noChars} getwpmCallback={setwpm} />}
        {!hasGameStarted && wpm && (
          <p>{`wpm: ${wpm}, mistakes: ${mistakes}, total: ${Math.round(
            wpm - mistakes
          )}`}</p>
        )}
        <textarea
          id="inputArea"
          disabled={textFieldDisabled}
          className={`${styles.textarea} form-control`}
          onChange={(e) => {
            if (sentence.length) {
              if (!hasGameStarted) {
                setHasGameStarted(true);
              }

              if (e.target.value[e.target.value.length - 1] === sentence[0]) {
                setNoChars(noChars + 1);
                setSentence(sentence.substring(1));
              } else {
                setMistakes(mistakes + 1);
              }
            }
          }}
        />

        <button
          className="btn active btn-primary mt-3"
          onClick={() => {
            getParagraph(setSentence);
            setHasGameStarted(false);
            setNoChars(0);
            document.getElementById("inputArea").value = "";
            setwpm(0);
            setMistakes(0);
            setTextFieldDisabled(false);
          }}
        >
          <p>New sentence</p>
        </button>
      </div>
    </>
  );
};

const getParagraph = (callback) => {
  fetch("https://geek-jokes.sameerkumar.website/api").then(async (data) => {
    let text = await data.text();
    text = text.replace(/['"]+/g, "");
    callback(text);
  });
};
