import userReducer from './UserReducer';
import { updateBioSuccess, clearBioStatus } from '../actions/actions';

describe('userReducer', () => {
  it('should reset bioUpdateStatus to null when clearBioStatus is dispatched', () => {
    const initialState = { bio: '', bioUpdateStatus: null, error: null };
    const updated = userReducer(initialState, updateBioSuccess({ bio: 'hello' }));
    expect(updated.bioUpdateStatus).toBe('success');
    const cleared = userReducer(updated, clearBioStatus());
    expect(cleared.bioUpdateStatus).toBeNull();
  });
});
