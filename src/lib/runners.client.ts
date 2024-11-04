
export async function createRunner(runnerUrl: string, token: string) {
  try {
    const response = await fetch(`/api/admin/runner/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "token":token, "runnerUrl":runnerUrl }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function readRunners(token: string) {
  try {
    const response = await fetch(`/api/admin/runner/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "token":token }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function deleteRunner(runnerUrl: string, token: string) {
  try {
    const response = await fetch(`/api/admin/runner/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "token":token, runnerUrl: runnerUrl }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return {};
  }
}
