const APIROOT = (import.meta as any).env.VITE_REACT_APP_API_ROOT;
export class APIError extends Error {
  private code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }

  public statusCode() {
    return this.code;
  }
}

const checkResponse = async (response: Response) => {
  if (!response.ok) {
    throw new APIError(response.status, response.statusText);
  }
  return await response.json();
};

export const callPing = async () => {
  const response = await fetch(`${APIROOT}/api/ping`, {
    method: "GET",
  });

  return await checkResponse(response);
};

export const callProtectedPing = async (token: string) => {
  const response = await fetch(`${APIROOT}/api/pingprotected/123`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await checkResponse(response);
};
