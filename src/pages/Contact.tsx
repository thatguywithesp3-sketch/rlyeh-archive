import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useIntersection } from '../hooks/useIntersection';

/* ═══════════════════════════════════════════════
   CLASSIFICATION OPTIONS
   ═══════════════════════════════════════════════ */
const CLASSIFICATIONS = [
  { value: '', label: 'Select classification…' },
  { value: 'dream', label: 'Dream contact' },
  { value: 'sighting', label: 'Sighting / phenomenon' },
  { value: 'artifact', label: 'Artifact or relic' },
  { value: 'cult', label: 'Cult activity' },
  { value: 'symbol', label: 'Unknown symbol or text' },
  { value: 'other', label: 'Other anomaly' },
];

/* ═══════════════════════════════════════════════
   STYLED COMPONENTS
   ═══════════════════════════════════════════════ */

const Page = styled.div`
  min-height: 100vh;
  background: #000000;
  position: relative;
  padding-bottom: 120px;
`;

const Hero = styled.section`
  padding: clamp(140px, 22vh, 240px) 24px clamp(32px, 5vh, 64px);
  text-align: center;
  max-width: 760px;
  margin: 0 auto;
`;

const Title = styled.h1<{ $visible: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(2.75rem, 10vw, 6rem);
  line-height: 1.1;
  margin: 0 0 20px;
  background: linear-gradient(
    to bottom,
    #ffffff 0%,
    rgba(255, 255, 255, 0.95) 15%,
    rgba(200, 200, 200, 0.7) 35%,
    rgba(120, 120, 120, 0.35) 55%,
    rgba(60, 60, 60, 0.1) 75%,
    transparent 90%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  filter: ${(p) => (p.$visible ? 'blur(0)' : 'blur(20px)')};
  transform: ${(p) => (p.$visible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 1.4s ease-out;
`;

const Intro = styled.p<{ $visible: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 auto;
  max-width: 560px;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 1.2s ease-out 0.3s;
`;

const FormWrapper = styled.section`
  max-width: 680px;
  margin: 0 auto;
  padding: 0 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 28px;
  border: 1px solid rgba(0, 255, 136, 0.14);
  border-radius: 4px;
  background: rgba(10, 12, 11, 0.6);
  padding: clamp(28px, 5vw, 48px);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(0, 255, 136, 0.6);
`;

const RequiredMark = styled.span`
  color: #ff006e;
  margin-left: 4px;
`;

const baseInput = `
  font-family: 'Univa Nova', sans-serif;
  font-size: 1rem;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  padding: 14px 16px;
  width: 100%;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.28);
  }
  &:focus {
    border-color: rgba(0, 255, 136, 0.55);
    box-shadow: 0 0 0 1px rgba(0, 255, 136, 0.25),
      0 0 24px rgba(0, 255, 136, 0.12);
  }
`;

const Input = styled.input`
  ${baseInput}
`;

const Select = styled.select`
  ${baseInput}
  cursor: pointer;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, rgba(0, 255, 136, 0.6) 50%),
    linear-gradient(135deg, rgba(0, 255, 136, 0.6) 50%, transparent 50%);
  background-position: calc(100% - 20px) center, calc(100% - 14px) center;
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;

  option {
    background: #0a0a0a;
    color: #ffffff;
  }
`;

const Textarea = styled.textarea`
  ${baseInput}
  min-height: 160px;
  resize: vertical;
  line-height: 1.6;
`;

const FieldError = styled.span`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.8125rem;
  color: #ff006e;
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.0625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.95);
  background: transparent;
  border: 2px solid rgba(0, 255, 136, 0.5);
  border-radius: 0;
  padding: 12px 32px;
  cursor: pointer;
  transition: font-family 0.5s cubic-bezier(0.25, 0.1, 0.25, 1),
    background 0.35s ease, color 0.35s ease, border-color 0.35s ease,
    box-shadow 0.35s ease, transform 0.2s ease;

  &:hover {
    background: #00ff88;
    color: #000000;
    border-color: #00ff88;
    font-family: 'UnifrakturCook', serif;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.4),
      0 0 40px rgba(0, 255, 136, 0.2);
  }
  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 560px) {
    align-self: stretch;
    text-align: center;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Confirmation = styled.div`
  text-align: center;
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 4px;
  background: rgba(0, 255, 136, 0.03);
  padding: clamp(40px, 7vw, 72px) 28px;
  animation: ${fadeIn} 0.8s ease-out both;
`;

const ConfirmGlyph = styled.div`
  font-family: 'UnifrakturCook', serif;
  font-size: clamp(2rem, 6vw, 3rem);
  color: #00ff88;
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
  margin-bottom: 20px;
`;

const ConfirmText = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.0625rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  max-width: 460px;
  margin: 0 auto 28px;
`;

const ConfirmRef = styled.p`
  font-family: 'Univa Nova', monospace;
  font-size: 0.875rem;
  letter-spacing: 0.08em;
  color: rgba(0, 255, 136, 0.55);
  margin-bottom: 32px;
`;

const ResetLink = styled.button`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.5);
  background: none;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2px 0;
  cursor: pointer;
  transition: color 0.3s ease, border-color 0.3s ease;

  &:hover {
    color: #00ff88;
    border-color: #00ff88;
  }
`;

const Disclaimer = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1.6;
  margin: 24px auto 0;
  max-width: 560px;
  text-align: center;
`;

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

interface FormState {
  designation: string;
  channel: string;
  classification: string;
  testimony: string;
}

const EMPTY: FormState = {
  designation: '',
  channel: '',
  classification: '',
  testimony: '',
};

/** Deterministic-ish reference code from the testimony length + classification. */
const makeReference = (form: FormState): string => {
  const year = new Date().getFullYear();
  const tag = (form.classification || 'unk').slice(0, 3).toUpperCase();
  const n = ((form.testimony.length * 37 + form.designation.length * 13) % 9000) + 1000;
  return `DOC-${year}-${tag}-${n}`;
};

const Contact: React.FC = () => {
  const { ref, isIntersecting } = useIntersection({ threshold: 0.1 });
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);

  const update =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.classification) next.classification = 'Select a classification for this record.';
    if (form.testimony.trim().length < 12)
      next.testimony = 'Provide at least a sentence of testimony.';
    if (form.channel && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.channel))
      next.channel = 'Enter a valid contact address, or leave it blank.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Static front-end only: no transmission leaves the browser.
    setSubmitted(makeReference(form));
  };

  const reset = () => {
    setForm(EMPTY);
    setErrors({});
    setSubmitted(null);
  };

  return (
    <Page>
      <Header />

      <Hero ref={ref}>
        <Title $visible={isIntersecting}>Submit Testimony</Title>
        <Intro $visible={isIntersecting}>
          The Archive accepts accounts of dreams, sightings, artifacts, and
          other anomalous phenomena. Records are reviewed under provisional
          classification. Speak plainly; omit nothing.
        </Intro>
      </Hero>

      <FormWrapper>
        {submitted ? (
          <Confirmation>
            <ConfirmGlyph>The Archive has recorded your account.</ConfirmGlyph>
            <ConfirmText>
              Your testimony has been sealed and filed for review. Should the
              material warrant it, the record will be cross-referenced against
              existing case files.
            </ConfirmText>
            <ConfirmRef>REFERENCE — {submitted}</ConfirmRef>
            <ResetLink type="button" onClick={reset}>
              Submit another account
            </ResetLink>
          </Confirmation>
        ) : (
          <>
            <Form onSubmit={handleSubmit} noValidate>
              <Field>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  type="text"
                  placeholder="Name or alias (optional)"
                  value={form.designation}
                  onChange={update('designation')}
                  autoComplete="name"
                />
              </Field>

              <Field>
                <Label htmlFor="channel">Return channel</Label>
                <Input
                  id="channel"
                  type="email"
                  placeholder="Email for follow-up (optional)"
                  value={form.channel}
                  onChange={update('channel')}
                  autoComplete="email"
                  aria-invalid={!!errors.channel}
                />
                {errors.channel && <FieldError>{errors.channel}</FieldError>}
              </Field>

              <Field>
                <Label htmlFor="classification">
                  Classification<RequiredMark>*</RequiredMark>
                </Label>
                <Select
                  id="classification"
                  value={form.classification}
                  onChange={update('classification')}
                  aria-invalid={!!errors.classification}
                >
                  {CLASSIFICATIONS.map((c) => (
                    <option key={c.value} value={c.value} disabled={c.value === ''}>
                      {c.label}
                    </option>
                  ))}
                </Select>
                {errors.classification && (
                  <FieldError>{errors.classification}</FieldError>
                )}
              </Field>

              <Field>
                <Label htmlFor="testimony">
                  Testimony<RequiredMark>*</RequiredMark>
                </Label>
                <Textarea
                  id="testimony"
                  placeholder="Describe what you witnessed, dreamt, or recovered. Include dates, locations, and recurring symbols where possible."
                  value={form.testimony}
                  onChange={update('testimony')}
                  aria-invalid={!!errors.testimony}
                />
                {errors.testimony && <FieldError>{errors.testimony}</FieldError>}
              </Field>

              <SubmitButton type="submit">Seal &amp; Submit</SubmitButton>
            </Form>
            <Disclaimer>
              This is a fictional archive. Submissions are processed entirely in
              your browser and are not transmitted or stored anywhere.
            </Disclaimer>
          </>
        )}
      </FormWrapper>

      <Footer />
    </Page>
  );
};

export default Contact;
