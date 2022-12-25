---
name: Bug report
about: Report a bug or regression in functionality
title: "[BUG]"
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

body:

  - type: textarea
    id: expected_behavior
    attributes:
      label: Minimal reproduction of the bug/regression with instructions
      description: Describe what the expected behavior would be.
    validations:
      required: true


  - type: textarea
    id: reproduction
    attributes:
      label: Minimal reproduction of the bug/regression with instructions
      description: Use the [Angular StackBlitz example](https://stackblitz.com/edit/angular) to create a reproduction.
      placeholder: If the bug/regression does not include a reproduction via StackBlitz or GitHub repo, your issue may be closed without resolution.
    validations:
      required: true

  - type: textarea
    id: version
    attributes:
      label: Versions of NgRx, Angular, Node, affected browser(s) and operating system(s)
      placeholder: |
        ngu-carousel:
        Angular:
        Node:
        Browser(s):
        Operating system(s):
    validations:
      required: true


  - type: textarea
    id: other
    attributes:
      label: Other information

  - type: checkboxes
    id: assistance
    attributes:
      label: I would be willing to submit a PR to fix this issue
      description: Assistance is provided if you need help submitting a pull request
      options:
        - label: 'Yes'
        - label: 'No'


**Screenshots**
If applicable, add screenshots to help explain your problem.
