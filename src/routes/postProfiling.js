import createError from 'http-errors';
import profiler from 'v8-profiler';
import t from 'tcomb-validation';

const RequiredParams = t.struct({
  action: t.enums.of(['start', 'stop']),
  appAdminPassword: t.String,
  name: t.String,
}, { strict: true });

export default function* postProfiling(next) {
  const { appAdminPassword: referenceAppAdminPassword, profilingRequiresHttps } = this.app.context.config.security;
  if(!this.request.secure && profilingRequiresHttps) {
    throw new createError.Forbidden('Profiling is only available via https');
  }
  const v = t.validate(this.request.body, RequiredParams);
  if(!v.isValid()) {
    throw new createError.BadRequest(v.firstError().message);
  }
  const { action, appAdminPassword, name } = this.request.body;
  if(appAdminPassword !== referenceAppAdminPassword) {
    throw new createError.Unauthorized();
  }
  if(action === 'start') {
    profiler.startProfiling(name, true);
    this.body = null;
  }
  else if(action === 'stop') {
    const profile = profiler.stopProfiling(name);
    if(typeof profile === 'undefined') {
      throw new createError.BadRequest('No such running profiling name');
    }
    Promise.promisifyAll(profile);
    const dump = yield profile.exportAsync();
    profile.delete();
    this.set('Content-Disposition', `attachment; filename=${name}.cpuprofile`);
    this.set('Content-Type', 'application/json');
    this.body = dump;
  }
  else {
    throw new createError.BadRequest();
  }
  yield next;
}
