/* eslint-disable react/prop-types */
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/colorforth.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import { useEffect, useRef } from "react";

const Editor = ({ socketRef, roomId, onCodeChange }) => {
	const editorRef = useRef();
	const codeMirrorInstance = useRef(null);

	useEffect(() => {
		if (!codeMirrorInstance.current) {
			codeMirrorInstance.current = CodeMirror.fromTextArea(editorRef.current, {
				mode: { name: "javascript", json: true },
				theme: "colorforth",
				autoCloseTags: true,
				autoCloseBrackets: true,
				lineNumbers: true,
				autocorrect: true,
			});
			codeMirrorInstance.current.setSize("100%", "100%");

			codeMirrorInstance.current.on("change", (instance, changes) => {
				const { origin } = changes;
				const code = instance.getValue();
				onCodeChange(code);
				if (origin !== "setValue") {
					socketRef?.current?.emit("code-change", {
						roomId,
						code,
					});
				}
			});
		}
	}, []);

	useEffect(() => {
		if (socketRef.current) {
			socketRef.current.on("code-change", ({ code }) => {
				if (code !== null) {
					console.log(code);
					codeMirrorInstance.current.setValue(code);
				}
			});
		}

		return () => {
			socketRef?.current.off("code-change");
		};
	}, [socketRef.current]);

	return (
		<div className="w-full h-screen">
			<textarea ref={editorRef}></textarea>
		</div>
	);
};

export default Editor;
