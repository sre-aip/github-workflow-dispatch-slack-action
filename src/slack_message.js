const BASE_URL = "https://github.com";

const createMessage = (owner, repo, workflow, workflowName, ref, inputs, mention, buttonNames, cancelWorkflow, cancelInputs) => {
  const headText = "Following workflow will be executed.";
  const inputsJson = inputs ? JSON.parse(inputs) : undefined;
  const cancelInputsJson = cancelInputs ? JSON.parse(cancelInputs) : inputsJson;
  const message = {
    text: headText,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${mention ? `${mention} ` : ""}:rocket: ${headText}`,
        },
      },
    ],
    attachments: [
      {
        color: "#3AA3E3",
        blocks: [
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Repository*\n<${BASE_URL}/${owner}/${repo}|${owner}/${repo}>`,
              },
              {
                type: "mrkdwn",
                text: `*Workflow Name*\n<${BASE_URL}/${owner}/${repo}/actions/workflows/${workflow}|${workflowName}>`,
              },
            ],
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: `*Ref*\n<${BASE_URL}/${owner}/${repo}/tree/${ref}|${ref}>`,
              },
            ],
          },
        ],
      },
    ],
  };

  if (inputs) {
    const prettyInput = JSON.stringify(inputsJson, null, 2);
    message.attachments[0].blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Workflow Inputs*\n\`\`\`${prettyInput}\`\`\``,
      },
    });
  }
  if (cancelWorkflow) {
    message.attachments[0].blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Cancel Workflow*\n<${BASE_URL}/${owner}/${repo}/actions/workflows/${cancelWorkflow}|${cancelWorkflow}>`,
      },
    });
    if (!!cancelInputsJson) {
      const prettyCancelInput = JSON.stringify(JSON.parse(cancelInputsJson), null, 2);
      message.attachments[0].blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Cancel Workflow Inputs*\n\`\`\`${prettyCancelInput}\`\`\``,
        },
      });
    }
  }

  message.attachments[0].blocks.push(
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Do you want to approve?",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: buttonNames && buttonNames.ok ? buttonNames.ok : "OK",
          },
          style: "primary",
          value: JSON.stringify({
            choice: true,
            request: {
              owner,
              repo,
              workflow_id: workflow,
              ref,
              inputs: inputsJson,
            },
          }),
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: buttonNames && buttonNames.cancel ? buttonNames.cancel : "Cancel",
          },
          style: "danger",
          value: JSON.stringify({
            choice: !!cancelWorkflow,
            request: {
              owner,
              repo,
              workflow_id: cancelWorkflow,
              ref,
              inputs: cancelInputsJson,
            },
          }),
        },
      ],
    },
  );

  return message;
};

module.exports = createMessage;
