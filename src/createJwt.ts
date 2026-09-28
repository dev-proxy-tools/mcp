import { execFile, ExecFileException } from 'child_process';

interface CreateJwtOptions {
  name?: string;
  issuer?: string;
  audiences?: string[];
  roles?: string[];
  scopes?: string[];
  claims?: string[];
  validFor?: number;
  signingKey?: string;
}

export const createJwt = async (options: CreateJwtOptions): Promise<string> => {
  const args: string[] = ['jwt', 'create'];

  if (options.name) {
    args.push('--name', options.name);
  }
  if (options.issuer) {
    args.push('--issuer', options.issuer);
  }
  if (options.audiences) {
    for (const audience of options.audiences) {
      args.push('--audiences', audience);
    }
  }
  if (options.roles) {
    for (const role of options.roles) {
      args.push('--roles', role);
    }
  }
  if (options.scopes) {
    for (const scope of options.scopes) {
      args.push('--scopes', scope);
    }
  }
  if (options.claims) {
    for (const claim of options.claims) {
      args.push('--claims', claim);
    }
  }
  if (options.validFor !== undefined) {
    args.push('--valid-for', options.validFor.toString());
  }
  if (options.signingKey) {
    args.push('--signing-key', options.signingKey);
  }

  return new Promise<string>((resolve, reject) => {
    execFile('devproxy', args, (error: ExecFileException | null, stdout: string, stderr: string) => {
      if (error) {
        reject(`Error creating JWT: ${error.message}`);
        return;
      }

      if (stderr) {
        reject(`Error creating JWT: ${stderr}`);
        return;
      }

      resolve(stdout.trim());
    });
  });
};
