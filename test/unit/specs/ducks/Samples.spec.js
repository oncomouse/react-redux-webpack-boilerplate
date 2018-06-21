import { expect } from 'chai';
import sinon from 'sinon';
import fetchMock from 'fetch-mock';
import { always, times } from 'ramda';
import post from 'TEST/fixtures/post.json';
import reducer, { addSampleAction, resetAction } from 'APP/ducks/Samples';
import { API_URL } from 'APP/api/config';

describe('ducks/Samples', () => {
  const initialState = [];
  // mock up a simple store:
  const store = {
    dispatch: sinon.stub(),
    getState: sinon.stub(),
  };
  store.dispatch.returnsArg(0);

  beforeEach(() => {
    fetchMock.mock(new RegExp(`${API_URL}/posts/[0-9]+.*$`), JSON.stringify(post), { method: 'get' });
  });
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
    store.dispatch.resetHistory();
    store.getState.resetHistory();
  });
  // Action tests:
  it('should dispatch post.title in response to a sampleAction', (done) => {
    addSampleAction()(store.dispatch, store.getState)
      .then((action) => {
        expect(store.dispatch.getCall(0).args[0].type).to.equal(action.type);
        expect(store.dispatch.getCall(0).args[0].payload.sample).to.equal(post.title);
        done();
      })
      .catch(done);
  });
  it('should dispatch RESET when given a resetAction', () => {
    const action = resetAction();
    store.dispatch(resetAction());
    expect(store.dispatch.getCall(0).args[0]).to.deep.equal(action);
  });
  // Reducer Tests:
  it('should reduce to initialState at start-up', () => {
    expect(reducer(undefined, {})).to.deep.equal(initialState);
  });
  it('should reduce to [post.title] w/ a addSampleAction', (done) => {
    addSampleAction()(store.dispatch, store.getState)
      .then((action) => {
        const result = reducer(initialState, action);
        expect(result).to.be.an('array');
        expect(result).to.have.length(1);
        expect(result[0]).to.be.a('string');
        expect(result[0]).to.equal(post.title);
        done();
      })
      .catch(done);
  });
  it('should reduce to initialState w/ a resetAction', () => {
    const result = reducer(times(always('gibberish'), 10), resetAction());
    expect(result).to.deep.equal(initialState);
  });
  it('should not change state w/ addSampleAction & a 404 Error', (done) => {
    fetchMock.get(new RegExp(`${API_URL}/posts/[0-9]+.*$`), 404, { overwriteRoutes: true });
    const testState = ['foo'];
    addSampleAction()(store.dispatch, store.getState).then((action) => {
      const result = reducer(testState, action);
      expect(result).to.deep.equal(testState);
      expect(store.dispatch).to.be.calledOnce;
      done();
    }).catch(done);
  });
});
